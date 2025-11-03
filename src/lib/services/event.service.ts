import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Event } from "@/lib/types";

const eventCollection = collection(db, "events");

export const createEvent = async (
  eventData: Omit<
    Event,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >,
  userId: string
) => {
  try {
    const docData = {
      ...eventData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
      updatedBy: userId,
    };
    const docRef = await addDoc(eventCollection, docData);
    return docRef.id;
  } catch (error) {
    console.error("[event.service] Error creating event: ", error);
    throw new Error("No se pudo registrar el evento.");
  }
};

export const getEventsByChildId = async (childId: string): Promise<Event[]> => {
  try {
    const q = query(
      eventCollection,
      where("childId", "==", childId),
      orderBy("eventTime", "desc")
    );
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];

    return events;
  } catch (error) {
    console.error("[event.service] Error getting events: ", error);
    throw new Error("No se pudo obtener el historial del niño.");
  }
};
