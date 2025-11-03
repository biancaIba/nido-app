import { collection, getDocs, query } from "firebase/firestore";

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
