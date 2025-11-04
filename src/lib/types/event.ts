import { Timestamp } from "firebase/firestore";
import { BaseModel } from "@/lib/types";

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
export interface NoteDetails {
  description?: string;
}

interface EventBase extends BaseModel {
  childId: string;
  teacherId: string; // User UID (role: 'teacher')
  eventTime: Timestamp; // When the event happened
}

export type Event = EventBase &
  (
    | { category: "food"; details: FoodDetails }
    | { category: "sleep"; details: SleepDetails }
    | { category: "diaper"; details: DiaperDetails }
    | { category: "activity"; details: NoteDetails } // Uses simple description
    | { category: "incident"; details: NoteDetails } // Uses simple description
    | { category: "general_note"; details: NoteDetails }
  );

export interface LastEventSummary {
  category: Event["category"];
  eventTime: Timestamp;
  description?: string; // e.g., "Ate lunch" or "Woke up"
}
