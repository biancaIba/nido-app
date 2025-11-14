import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";

import { db } from "@/config/firebase";
import { Classroom } from "@/lib/types";

const classroomCollection = collection(db, "classrooms");

export const getClassrooms = async (): Promise<Classroom[]> => {
  try {
    const q = query(classroomCollection);
    const querySnapshot = await getDocs(q);

    const classrooms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Classroom[];

    return classrooms;
  } catch (error) {
    console.error("[classroom.service] Error getting classrooms: ", error);
    throw new Error("No se pudieron obtener las salas.");
  }
};

/**
 * Retrieves a specific classroom by its ID.
 * @param classroomId The ID of the classroom.
 * @returns The classroom object or null if not found.
 */
export const getClassroomById = async (
  classroomId: string
): Promise<Classroom | null> => {
  if (!classroomId) return null;

  try {
    const docRef = doc(db, "classrooms", classroomId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Classroom;
    } else {
      console.warn(
        `[classroom.service] No classroom found with id: ${classroomId}`
      );
      return null;
    }
  } catch (error) {
    console.error("[classroom.service] Error getting classroom by ID: ", error);
    throw new Error("No se pudo obtener la información de la sala.");
  }
};
