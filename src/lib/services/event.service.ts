import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  FieldValue,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db } from "@/config";
import {
  Event,
  NewDocument,
  LastEventSummary,
  FoodDetails,
  NoteDetails,
  DiaperDetails,
  SleepDetails,
} from "@/lib/types";

// Define the payload from the modal, omitting fields we will set in the service
type EventCreationPayload = Omit<NewDocument<Event>, "childId" | "teacherId">;

// Helper type for creating events with FieldValue timestamps
type EventWrite = Omit<Event, "createdAt" | "updatedAt"> & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

/**
 * Creates one or more events (for one or more children) in a single batch.
 * It also updates the 'lastEvent' summary on each corresponding Child document.
 *
 * @param payload The common event data (category, details, etc.) from the modal.
 * @param childIds An array of child IDs to create the event for.
 * @param teacherId The UID of the teacher creating the event.
 */
export async function createEvents(
  payload: EventCreationPayload,
  childIds: string[],
  teacherId: string
) {
  // 1. Get a new batch instance
  const batch = writeBatch(db);
  const timestamp = serverTimestamp(); // Use server-side timestamp

  // 2. Create the denormalized summary for the Child document
  // We need a helper to create a human-readable description.
  const summaryDescription = createEventSummaryDescription(payload);

  const lastEventSummary: LastEventSummary = {
    category: payload.category,
    eventTime: payload.eventTime, // The time the event happened
    description: summaryDescription,
  };

  // 3. Loop over each child and add operations to the batch
  for (const childId of childIds) {
    // 3a. Create a ref for the new event document
    const newEventRef = doc(collection(db, "events"));

    // 3b. Create the full event document with audit fields
    const newEventData: EventWrite = {
      ...payload,
      id: newEventRef.id, // Add the generated ID
      childId: childId,
      teacherId: teacherId,

      // Add BaseModel audit fields
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
      createdBy: teacherId,
      updatedBy: teacherId,
      deletedBy: null,
    };

    // 3c. Create a ref for the child to be updated
    const childRef = doc(db, "children", childId);

    // 3d. Add operations to the batch
    batch.set(newEventRef, newEventData); // SET the new event
    batch.update(childRef, {
      // UPDATE the child
      lastEvent: lastEventSummary,
      updatedAt: timestamp,
      updatedBy: teacherId,
    });
  }

  // 4. Commit the batch
  try {
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error creating events batch: ", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Retrieves all events for a specific child, ordered by most recent first.
 * @param childId The ID of the child.
 */
export async function getEventsByChildId(childId: string): Promise<Event[]> {
  if (!childId) return [];

  try {
    const eventsCollection = collection(db, "events");
    const q = query(
      eventsCollection,
      where("childId", "==", childId),
      orderBy("eventTime", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Event);
  } catch (error) {
    console.error(
      `[event.service] Error getting events for child ${childId}: `,
      error
    );
    throw new Error("No se pudieron obtener los eventos del alumno.");
  }
}

/**
 * Helper function to create a short description for the 'lastEvent' summary.
 * We can expand this later.
 */
function createEventSummaryDescription(payload: EventCreationPayload): string {
  switch (payload.category) {
    case "food":
      return `Comió ${(payload.details as FoodDetails).mealType}.`;
    case "sleep":
      return (
        "Inició una siesta a las " +
        new Date(
          (payload.details as SleepDetails).startTime.seconds * 1000
        ).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) +
        "."
      );
    case "diaper":
      return `Cambio de pañal (${(payload.details as DiaperDetails).type}).`;
    case "activity":
      return `Actividad: ${(payload.details as NoteDetails).description}`;
    case "incident":
      return `Incidente: ${(payload.details as NoteDetails).description}`;
    default:
      return "Nuevo evento registrado.";
  }
}
