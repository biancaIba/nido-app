// src/types/user.ts
import { BaseModel } from "@/lib/types";

export type UserRole = "admin" | "teacher" | "parent";

// We Omit 'id' from BaseModel because 'uid' IS the document ID.
// We still keep the other useful audit fields.
export interface User extends Omit<BaseModel, "id"> {
  uid: string; // This is the Firebase Auth UID and the Document ID
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole[];
  childrenIds?: string[]; // Array of Child IDs
}
