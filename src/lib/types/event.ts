import { Timestamp } from "firebase/firestore";
import { BaseModel, NewDocument } from "@/lib/types";

export type EventCategory =
  | "food"
  | "sleep"
  | "diaper"
  | "activity"
  | "incident"
  | "medicine"
  | "general_note";

export interface FoodDetails {
  mealType: "breakfast" | "lunch" | "snack";
  description?: string;
}

export interface SleepDetails {
  startTime: Timestamp;
  endTime?: Timestamp;
}

export interface DiaperDetails {
  type: "pee" | "poo" | "both";
  observation?: string;
}

export interface MedicineDetails {
  name: string;
  dose: string;
}

export interface NoteDetails {
  description?: string;
}

interface EventBase extends BaseModel {
  childId: string;
  teacherId: string;
  eventTime: Timestamp;
}

export type Event = EventBase &
  (
    | { category: "food"; details: FoodDetails }
    | { category: "sleep"; details: SleepDetails }
    | { category: "diaper"; details: DiaperDetails }
    | { category: "activity"; details: NoteDetails }
    | { category: "incident"; details: NoteDetails }
    | { category: "medicine"; details: MedicineDetails }
    | { category: "general_note"; details: NoteDetails }
  );
export interface LastEventSummary {
  category: EventCategory;
  eventTime: Timestamp;
  description?: string;
}

// This type represents the data shape submitted from the form,
// before the service layer adds IDs and audit timestamps.
export type EventFormPayload = Omit<
  NewDocument<Event>,
  | "id"
  | "childId"
  | "teacherId"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "createdBy"
  | "updatedBy"
  | "deletedBy"
>;
