import { collection, getDocs, query, where } from "firebase/firestore";

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
