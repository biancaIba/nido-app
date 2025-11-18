import { Timestamp } from "firebase/firestore";

import { BaseModel, LastEventSummary } from "@/lib/types";

export interface Child extends BaseModel {
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  avatarSeed: string;
  classroomId: string; // ID of the Classroom
  parentIds: string[]; // Array of User IDs (with role 'parent')
  // Emails of parents invited but not yet registered/linked via UID
  authorizedEmails: string[];
  lastEvent?: LastEventSummary; // Summary of the last event
}

/**
 * Represents the data structure for the child creation/edit form.
 * It omits system-managed fields like id, timestamps, parentIds, and lastEvent.
 * The dateOfBirth is a string to match the input[type="date"] value.
 */
export type ChildFormData = Pick<
  Child,
  "firstName" | "lastName" | "classroomId" | "avatarSeed" | "authorizedEmails"
> & {
  dateOfBirth: string; // Use string for form input, will be converted to Timestamp on save
};
