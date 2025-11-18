// src/types/user.ts
import { BaseModel } from "@/lib/types";

export type UserRole = "admin" | "teacher" | "parent";

/**
 * Profile data specific to users with the 'teacher' role.
 * This object will be present on the User document if the user is a teacher.
 */
export interface TeacherProfile {
  phone?: string;
  dateOfBirth?: string; // Consider storing as ISO string or Timestamp for easier manipulation
  shift?: string;
  employeeId?: string;
  classroomIds?: string[]; // IDs of the classrooms the teacher is assigned to
}

// We Omit 'id' from BaseModel because 'uid' IS the document ID.
// We still keep the other useful audit fields.
export interface User extends Omit<BaseModel, "id"> {
  uid: string; // This is the Firebase Auth UID and the Document ID
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole[];
  childrenIds?: string[]; // Array of Child IDs for parents

  // Role-specific profiles
  teacherProfile?: TeacherProfile;
}
