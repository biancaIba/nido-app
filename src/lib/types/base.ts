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
