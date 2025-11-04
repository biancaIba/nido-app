import { Timestamp } from "firebase/firestore";

import { BaseModel, LastEventSummary } from "@/lib/types";

export interface Child extends BaseModel {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  avatarUrl?: string;
  classroomId: string; // ID of the Classroom
  parentIds: string[]; // Array of User IDs (with role 'parent')
  lastEvent?: LastEventSummary; // Summary of the last event
}
