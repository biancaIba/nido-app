import { Base } from "@/types";

export interface Event extends Base {
  childId: string;
  type: EventType;
  description: string;
  date: Date;
}

interface EventType {
  id: string;
  name: "meal" | "nap" | "diaperChange" | "activity" | "note";
}
