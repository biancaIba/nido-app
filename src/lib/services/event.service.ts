import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Event, LastEventSummary } from "@/lib/types";

const eventCollection = collection(db, "events");

export const createEvent = async (
  eventData: Omit<
    Event,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >,
  userId: string
) => {
  const batch = writeBatch(db);

  const newEventRef = doc(collection(db, "events"));
  const eventDocData = {
    ...eventData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: userId,
    updatedBy: userId,
  };
  batch.set(newEventRef, eventDocData);

  const childRef = doc(db, "children", eventData.childId);
  const eventSummary: LastEventSummary = {
    type: eventData.type,
    eventTime: eventData.eventTime,
    description: eventData.description,
  };

  batch.update(childRef, {
    lastEvent: eventSummary,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });

  try {
    await batch.commit();
    return newEventRef.id;
  } catch (error) {
    console.error("[event.service] Error committing event batch: ", error);
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
