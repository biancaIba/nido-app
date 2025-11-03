import { BaseModel, LastEventSummary } from "@/lib/types";

export interface Child extends BaseModel {
  firstName: string;
  lastName: string;
  avatar?: string;
  classroomId: string; // ID of the Classroom
  parentIds: string[]; // Array of User IDs (with role 'parent')
  lastEvent?: LastEventSummary | null; // Summary of the last event
}
