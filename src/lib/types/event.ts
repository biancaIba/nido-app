import { Timestamp } from "firebase/firestore";
import { BaseModel, NewDocument } from "@/lib/types";

export type EventCategory =
  | "Comida"
  | "Sueño"
  | "Baño"
  | "Actividad"
  | "Incidente"
  | "Medicamento";

export interface FoodDetails {
  mealType: "Desayuno" | "Almuerzo" | "Merienda";
  description?: string;
}

export interface SleepDetails {
  startTime: Timestamp;
  endTime?: Timestamp;
}

export interface DiaperDetails {
  type: "Pis" | "Popó" | "Ambos";
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
    | { category: "Comida"; details: FoodDetails }
    | { category: "Sueño"; details: SleepDetails }
    | { category: "Baño"; details: DiaperDetails }
    | { category: "Actividad"; details: NoteDetails }
    | { category: "Incidente"; details: NoteDetails }
    | { category: "Medicamento"; details: MedicineDetails }
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
