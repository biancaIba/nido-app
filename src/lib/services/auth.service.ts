import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/config";
import { TeacherFormData, User } from "@/lib/types";
import { sendEmailInvitation } from "@/lib/services";

const usersCollection = collection(db, "users");

export async function createUserInDb(
  uid: string,
  userData: Omit<
    User,
    "uid" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >
) {
  const userRef = doc(db, "users", uid);
  const dataWithBaseFields = {
    ...userData,
    uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: uid,
    updatedBy: uid,
  };

  await setDoc(userRef, dataWithBaseFields);
  return uid;
}

export async function getUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() }) as unknown as User
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ uid: docSnap.id, ...docSnap.data() } as unknown as User)
    : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(usersCollection, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { uid: doc.id, ...doc.data() } as unknown as User;
}

export async function deleteUser(id: string): Promise<void> {
  const userRef = doc(db, "users", id);
  await deleteDoc(userRef);
}

export async function migrateUser(
  oldId: string,
  newId: string,
  data: User
): Promise<User> {
  const newUserRef = doc(db, "users", newId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { uid, ...userData } = data;

  const newUserData = {
    ...userData,
    uid: newId,
    updatedAt: Timestamp.now(),
  };

  await setDoc(newUserRef, newUserData);
  await deleteUser(oldId);

  return { ...newUserData } as unknown as User;
}

/**
 * Retrieves all users with the 'teacher' role.
 * @returns A promise that resolves to an array of User objects.
 */
export async function getTeachers(): Promise<User[]> {
  try {
    const q = query(
      usersCollection,
      where("role", "array-contains", "teacher")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as User);
  } catch (error) {
    console.error("[auth.service] Error fetching teachers:", error);
    throw new Error("No se pudieron obtener los maestros.");
  }
}

/**
 * Creates a new teacher user, saves them to Firestore, and sends an invitation.
 * NOTE: This function assumes you have a backend mechanism to create the user in Firebase Auth.
 * For this MVP, we'll focus on creating the Firestore document and sending the email.
 * The user will complete their registration via the link.
 * @param teacherData The form data for the new teacher.
 * @param adminId The UID of the admin creating the teacher.
 * @returns The newly created User object.
 */
export const createTeacher = async (
  teacherData: TeacherFormData,
  adminId: string
): Promise<User> => {
  // 1. Enviar invitación por correo PRIMERO
  try {
    console.log(`Enviando invitación al maestro ${teacherData.firstName}...`);
    await sendEmailInvitation({
      toEmail: teacherData.email,
    });
    console.log("Invitación enviada exitosamente.");
  } catch (error) {
    console.error("[auth.service] Fallo al enviar correo al maestro:", error);
    throw new Error(
      "No se pudo enviar la invitación por correo. Verifica la dirección e inténtalo de nuevo."
    );
  }

  // 2. Si el correo se envía, crear el documento del usuario en Firestore
  // Para el MVP, el UID será autogenerado por Firestore, ya que el usuario aún no existe en Auth.
  // El usuario reclamará este perfil al registrarse con el mismo email.
  try {
    const userDocRef = doc(collection(db, "users")); // Genera un ID automático

    const newUser: Omit<User, "uid"> = {
      email: teacherData.email.toLowerCase(),
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      role: ["teacher"],

      avatarSeed: teacherData.avatarSeed,
      phone: teacherData.phone,
      dateOfBirth: teacherData.dateOfBirth,

      teacherProfile: {
        shift: teacherData.shift,
        employeeId: teacherData.employeeId,
        classroomIds: teacherData.classroomIds,
      },

      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deletedAt: null,
      createdBy: adminId,
      updatedBy: adminId,
      deletedBy: null,
    };

    await setDoc(userDocRef, newUser);

    return {
      ...newUser,
      uid: userDocRef.id, // Usamos el ID del documento como UID temporal
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as User;
  } catch (dbError) {
    console.error("[auth.service] Error al crear el maestro en BD:", dbError);
    throw new Error(
      "Se envió el correo, pero no se pudo guardar el maestro en la base de datos."
    );
  }
};
