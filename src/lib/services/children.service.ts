import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Child, ChildFormData } from "@/lib/types";
import { sendEmailInvitation } from "@/lib/services";

const childrenCollection = collection(db, "children");

/**
 * Retrieves all children from the database.
 * @returns A promise that resolves to an array of Child objects.
 */
export const getAllChildren = async (): Promise<Child[]> => {
  try {
    const childrenQuery = query(collection(db, "children"));
    const querySnapshot = await getDocs(childrenQuery);
    const children: Child[] = [];
    querySnapshot.forEach((doc) => {
      children.push({ id: doc.id, ...doc.data() } as Child);
    });
    return children;
  } catch (error) {
    console.error("[children.service] Error fetching all children: ", error);
    throw new Error("No se pudieron obtener los niños.");
  }
};

/**
 * Creates a new child document in Firestore.
 * @param childData The data for the new child.
 * @param adminId The UID of the admin creating the child.
 * @returns The newly created Child object.
 */

export const createChild = async (
  childData: ChildFormData,
  adminId: string
): Promise<Child> => {
  try {
    if (childData.authorizedEmails && childData.authorizedEmails.length > 0) {
      console.log(
        `Validando y enviando invitaciones para ${childData.firstName}...`
      );

      const emailPromises = childData.authorizedEmails
        .filter((email) => email.trim() !== "")
        .map(async (email) => {
          const response = await sendEmailInvitation({
            toEmail: email,
            childName: childData.firstName,
          });
          if (!response || response.success === false) {
            throw new Error(`Fallo al enviar invitación al correo: ${email}`);
          }
          return response;
        });

      // Promise.all se detendrá si alguna promesa es rechazada (falla).
      await Promise.all(emailPromises);
      console.log("Todas las invitaciones se enviaron exitosamente.");
    }
  } catch (error) {
    // Si algún correo falla, detenemos todo el proceso.
    console.error(
      "[children.service] Fallo crítico al enviar correos, no se creará el niño:",
      error
    );
    // Lanzamos un error específico para que el frontend pueda mostrar un mensaje claro.
    throw new Error(
      "No se pudo enviar la invitación por correo. Por favor, verifica las direcciones e inténtalo de nuevo."
    );
  }

  try {
    const dateOfBirthTimestamp = Timestamp.fromDate(
      new Date(childData.dateOfBirth)
    );
    const docData = {
      ...childData,
      dateOfBirth: dateOfBirthTimestamp,
      parentIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: adminId,
      updatedBy: adminId,
    };

    const childRef = await addDoc(collection(db, "children"), docData);

    return {
      id: childRef.id,
      ...childData,
      dateOfBirth: dateOfBirthTimestamp,
      parentIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Child;
  } catch (dbError) {
    console.error(
      "[children.service] Error al crear el niño en la BD después de enviar correos:",
      dbError
    );
    throw new Error(
      "Se enviaron los correos, pero no se pudo guardar el alumno en la base de datos."
    );
  }
};

export const getChildrenByClassroomId = async (
  classroomId: string
): Promise<Child[]> => {
  if (!classroomId) return [];

  try {
    const q = query(
      childrenCollection,
      where("classroomId", "==", classroomId)
    );
    const querySnapshot = await getDocs(q);

    const children = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Child[];

    return children;
  } catch (error) {
    console.error("[children.service] Error getting children: ", error);
    throw new Error("No se pudieron obtener los niños de la sala.");
  }
};

export const getChildById = async (childId: string): Promise<Child | null> => {
  if (!childId) return null;

  try {
    const docRef = doc(db, "children", childId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Child;
    } else {
      console.warn(`[children.service] No child found with id: ${childId}`);
      return null;
    }
  } catch (error) {
    console.error("[children.service] Error getting child by ID: ", error);
    throw new Error("No se pudo obtener la información del alumno.");
  }
};

/**
 * Retrieves multiple children by their document IDs.
 * @param ids An array of child document IDs.
 * @returns A promise that resolves to an array of Child objects.
 */
export const getChildrenByIds = async (ids: string[]): Promise<Child[]> => {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    // Usamos el operador 'in' para obtener todos los documentos en una sola consulta
    const q = query(childrenCollection, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Child
    );
  } catch (error) {
    console.error("[children.service] Error getting children by IDs: ", error);
    throw new Error("No se pudo obtener la información de los niños.");
  }
};
