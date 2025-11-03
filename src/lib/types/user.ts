import { BaseModel } from "@/lib/types";

export type UserRole = "admin" | "teacher" | "parent";

export interface User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoUrl?: string;

  // For 'teacher': ID of the classroom they manage
  classroomId?: string;

  // For 'parent': IDs of the children associated
  childrenIds?: string[];
}
