import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/config";
import { User } from "@/lib/types";

const usersCollection = collection(db, "users");

export async function createUserInDb(
  uid: string,
  userData: Omit<
    User,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >
) {
  const userRef = doc(db, "users", uid);
  const dataWithBaseFields = {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: uid,
    updatedBy: uid,
  };

  await setDoc(userRef, dataWithBaseFields);
  return uid;
}

export async function getUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as unknown as User)
  );
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as unknown as User)
    : null;
}
