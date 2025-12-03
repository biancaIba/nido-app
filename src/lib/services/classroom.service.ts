import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Classroom } from "@/lib/types";

const classroomCollection = collection(db, "classrooms");

/**
 * Creates a new classroom document in Firestore.
 * @param name The name of the new classroom.
 * @param teacherId The UID of the user creating the classroom.
 * @returns The newly created Classroom object.
 */
export const createClassroom = async (
  name: string,
  teacherId: string
): Promise<Classroom> => {
  try {
    const classroomRef = await addDoc(collection(db, "classrooms"), {
      name,
      teacherIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: teacherId,
      updatedBy: teacherId,
      deletedAt: null,
      deletedBy: null,
    });

    return {
      id: classroomRef.id,
      name,
      teacherIds: [],
      createdAt: new Date(), // Approximate client-side timestamp
      updatedAt: new Date(),
    } as unknown as Classroom;
  } catch (error) {
    console.error("[classroom.service] Error creating classroom: ", error);
    throw new Error("No se pudo crear la sala.");
  }
};

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

export const updateClassroom = async (
  classroomId: string,
  name: string,
  teacherId: string
): Promise<void> => {
  try {
    const classroomRef = doc(db, "classrooms", classroomId);
    await updateDoc(classroomRef, {
      name,
      updatedAt: serverTimestamp(),
      updatedBy: teacherId,
    });
  } catch (error) {
    console.error("[classroom.service] Error updating classroom: ", error);
    throw new Error("No se pudo actualizar la sala.");
  }
};
