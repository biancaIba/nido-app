// src/types/user.ts
import { BaseModel } from "@/lib/types";
import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "teacher" | "parent";

/**
 * Form data for creating or editing a teacher.
 */
export interface TeacherFormData extends TeacherProfile {
  email: string;
  firstName: string;
  lastName: string;

  // Optional profile fields
  phone?: string;
  dateOfBirth?: string;
}

/**
 * Profile data specific to users with the 'teacher' role.
 * This object will be present on the User document if the user is a teacher.
 */
export interface TeacherProfile {
  shift?: string;
  employeeId?: string;
  classroomIds: string[]; // IDs of the classrooms the teacher is assigned to
}

// We Omit 'id' from BaseModel because 'uid' IS the document ID.
// We still keep the other useful audit fields.
export interface User extends Omit<BaseModel, "id"> {
  uid: string; // This is the Firebase Auth UID and the Document ID

  email: string;
  firstName: string;
  lastName: string;
  role: UserRole[];

  // Optional profile fields
  photoURL?: string;
  phone?: string;
  dateOfBirth?: string | Timestamp;

  childrenIds?: string[]; // Array of Child IDs for parents

  // Role-specific profiles
  teacherProfile?: TeacherProfile;
}
