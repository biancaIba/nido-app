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
    // Convert date string to Firestore Timestamp
    const dateOfBirthTimestamp = Timestamp.fromDate(
      new Date(childData.dateOfBirth)
    );

    const docData = {
      ...childData,
      dateOfBirth: dateOfBirthTimestamp, // Use the converted Timestamp
      avatarUrl: `https://avatar.vercel.sh/${childData.firstName}.png`,
      parentIds: [],
      lastEvent: null,
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
      avatarUrl: docData.avatarUrl,
      parentIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Child;
  } catch (error) {
    console.error("[children.service] Error creating child: ", error);
    throw new Error("No se pudo crear el alumno.");
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
      (doc) => ({ id: doc.id, ...doc.data() } as Child)
    );
  } catch (error) {
    console.error("[children.service] Error getting children by IDs: ", error);
    throw new Error("No se pudo obtener la información de los niños.");
  }
};
