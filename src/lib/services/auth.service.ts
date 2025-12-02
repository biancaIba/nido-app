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
  updateDoc,
  arrayUnion,
  serverTimestamp,
  FieldValue,
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
  const q = query(usersCollection, where("email", "==", email.toLowerCase()));
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
 * Creates a new teacher user or updates an existing user to have the teacher role.
 * It checks if a user with the given email already exists.
 * If yes, it updates the user with the teacher role and profile.
 * If no, it creates a new user document stub and sends an invitation.
 * @param teacherData The form data for the new teacher.
 * @param adminId The UID of the admin performing the action.
 * @returns The created or updated User object.
 */
export const createTeacher = async (
  teacherData: TeacherFormData,
  adminId: string
): Promise<User> => {
  const normalizedEmail = teacherData.email.toLowerCase();
  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    // User already exists, update them
    console.log(
      `User with email ${normalizedEmail} already exists. Updating with teacher role.`
    );
    const userRef = doc(db, "users", existingUser.uid);

    // Prepare the data for the update operation
    const updateData: { [key: string]: unknown } = {
      role: arrayUnion("teacher"), // Atomically adds 'teacher' to the array if it's not there
      teacherProfile: {
        ...(existingUser.teacherProfile || {}),
        shift: teacherData.shift,
        employeeId: teacherData.employeeId,
        classroomIds: teacherData.classroomIds,
      },
      updatedAt: Timestamp.now(),
      updatedBy: adminId,
    };

    // Conditionally add optional fields from the form to the update payload
    if (teacherData.phone) {
      updateData.phone = teacherData.phone;
    }
    if (teacherData.dateOfBirth) {
      updateData.dateOfBirth = teacherData.dateOfBirth;
    }

    await updateDoc(userRef, updateData);

    const updatedUser = await getUserById(existingUser.uid);
    return updatedUser!; // We know the user exists
  } else {
    // User does not exist, create a new one and send invitation
    console.log(
      `No existing user found. Creating new teacher invite for ${normalizedEmail}.`
    );
    try {
      await sendEmailInvitation({ toEmail: normalizedEmail });
    } catch (error) {
      console.error("[auth.service] Failed to send teacher invitation:", error);
      throw new Error(
        "No se pudo enviar la invitación por correo. Verifica la dirección e inténtalo de nuevo."
      );
    }

    try {
      const userDocRef = doc(collection(db, "users"));

      const newUserPayload: Omit<User, "uid" | "createdAt" | "updatedAt"> & {
        createdAt: FieldValue;
        updatedAt: FieldValue;
      } = {
        email: normalizedEmail,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        role: ["teacher"],

        teacherProfile: {
          shift: teacherData.shift,
          employeeId: teacherData.employeeId,
          classroomIds: teacherData.classroomIds,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminId,
        updatedBy: adminId,
        deletedAt: null,
        deletedBy: null,
      };

      // Conditionally add optional fields to avoid 'undefined' errors
      if (teacherData.phone) newUserPayload.phone = teacherData.phone;
      if (teacherData.dateOfBirth)
        newUserPayload.dateOfBirth = teacherData.dateOfBirth;

      await setDoc(userDocRef, newUserPayload);

      return {
        uid: userDocRef.id,
        ...newUserPayload,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      } as User;
    } catch (dbError) {
      console.error(
        "[auth.service] Error creating teacher in DB after sending email:",
        dbError
      );
      throw new Error(
        "Se envió el correo, pero no se pudo guardar el maestro en la base de datos."
      );
    }
  }
};

export const updateTeacher = async (
  teacherId: string,
  teacherData: Partial<TeacherFormData>,
  adminId: string
): Promise<void> => {
  try {
    const teacherRef = doc(db, "users", teacherId);
    const userSnap = await getDoc(teacherRef);
    if (!userSnap.exists()) throw new Error("Teacher not found");

    const existingUser = userSnap.data() as User;

    // Prepare the base update data
    const updateData: { [key: string]: unknown } = {
      updatedAt: Timestamp.now(),
      updatedBy: adminId,
    };

    // Selectively add fields to update to avoid overwriting with undefined
    if (teacherData.firstName) updateData.firstName = teacherData.firstName;
    if (teacherData.lastName) updateData.lastName = teacherData.lastName;
    if (teacherData.phone) updateData.phone = teacherData.phone;
    if (teacherData.dateOfBirth)
      updateData.dateOfBirth = teacherData.dateOfBirth;

    // Merge teacherProfile instead of overwriting
    const newTeacherProfile = {
      ...existingUser.teacherProfile,
      ...(teacherData.shift !== undefined && { shift: teacherData.shift }),
      ...(teacherData.employeeId !== undefined && {
        employeeId: teacherData.employeeId,
      }),
      ...(teacherData.classroomIds && {
        classroomIds: teacherData.classroomIds,
      }),
    };
    updateData.teacherProfile = newTeacherProfile;

    await updateDoc(teacherRef, updateData);
  } catch (error) {
    console.error("[auth.service] Error updating teacher: ", error);
    throw new Error("No se pudo actualizar el maestro.");
  }
};
