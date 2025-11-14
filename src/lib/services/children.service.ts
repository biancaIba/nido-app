import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Child } from "@/lib/types";

const childrenCollection = collection(db, "children");

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
    throw new Error("No se pudieron obtener los alumnos de la sala.");
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
      (doc) => ({ id: doc.id, ...doc.data() } as Child)
    );
  } catch (error) {
    console.error("[children.service] Error getting children by IDs: ", error);
    throw new Error("No se pudo obtener la información de los alumnos.");
  }
};
