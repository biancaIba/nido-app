import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

import { db } from "@/config";
import { User } from "@/lib/types";

const usersCollection = collection(db, "users");

export async function addUser(user: Omit<User, "id">) {
  const docRef = await addDoc(usersCollection, user);
  return docRef.id;
}

export async function getUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as User)
    : null;
}
