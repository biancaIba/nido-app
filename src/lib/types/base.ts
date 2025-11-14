import { Timestamp } from "firebase/firestore";

export interface BaseModel {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string;
  deletedBy: string | null;
}

/**
 * Creates a "payload" type for a new document.
 * It omits all BaseModel audit fields, as they will be set by Firestore.
 */
export type NewDocument<T extends BaseModel> = Omit<T, keyof BaseModel>;
