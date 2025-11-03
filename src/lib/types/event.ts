import { Timestamp } from "firebase/firestore";
import { BaseModel } from "@/lib/types";

export type EventType =
  | "food"
  | "sleep"
  | "diaper"
  | "activity"
  | "incident"
  | "general_note";

export interface FoodDetails {
  mealType: "breakfast" | "lunch" | "snack";
  description: string;
}

export interface SleepDetails {
  startTime: Timestamp;
  endTime?: Timestamp;
}

export interface DiaperDetails {
  type: "pee" | "poo" | "both";
  observation?: string;
}

export interface Event extends BaseModel {
  childId: string;
  teacherId: string;
  eventTime: Timestamp;
  type: EventType;
  description: string;

  // Optional details based on event type
  foodDetails?: FoodDetails;
  sleepDetails?: SleepDetails;
  diaperDetails?: DiaperDetails;
}

export interface LastEventSummary {
  type: EventType;
  eventTime: Timestamp;
  description: string;
}
