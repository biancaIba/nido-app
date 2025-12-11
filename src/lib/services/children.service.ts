import {
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Child, ChildFormData } from "@/lib/types";
import { getUserByEmail, sendEmailInvitation } from "@/lib/services";

const childrenCollection = collection(db, "children");

/**
 * Retrieves all children from the database.
 * @returns A promise that resolves to an array of Child objects.
 */
export const getAllChildren = async (): Promise<Child[]> => {
  try {
    const childrenQuery = query(collection(db, "children"));
    const querySnapshot = await getDocs(childrenQuery);
    const children: Child[] = [];
    querySnapshot.forEach((doc) => {
      children.push({ id: doc.id, ...doc.data() } as Child);
    });
    return children;
  } catch (error) {
    console.error("[children.service] Error fetching all children: ", error);
    throw new Error("No se pudieron obtener los niños.");
  }
};

/**
 * Creates a new child and links to parent users, creating user stubs if necessary.
 * Sends email invitations to new parent users.
 * @param childData The data for the new child.
 * @param adminId The UID of the admin creating the child.
 * @returns The newly created Child object.
 */
export const createChild = async (
  childData: ChildFormData,
  adminId: string
): Promise<Child> => {
  const batch = writeBatch(db);
  const parentUids: string[] = [];

  // 1. Handle parent invitations and linking
  if (childData.authorizedEmails && childData.authorizedEmails.length > 0) {
    for (const email of childData.authorizedEmails) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await getUserByEmail(normalizedEmail);

      if (existingUser) {
        // User exists: update their roles and children
        console.log(`Linking child to existing user: ${email}`);
        const userRef = doc(db, "users", existingUser.uid);
        batch.update(userRef, {
          role: arrayUnion("parent"),
          // childrenIds will be added later with the new child's ID
        });
        parentUids.push(existingUser.uid);
      } else {
        // User does not exist: create a new user stub
        console.log(`Creating new parent invite for: ${email}`);
        const newUserRef = doc(collection(db, "users"));
        batch.set(newUserRef, {
          email: normalizedEmail,
          role: ["parent"],
          // childrenIds will be added later with the new child's ID
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: adminId,
          updatedBy: adminId,
        });
        parentUids.push(newUserRef.id);
        // We can still send an email invitation
        await sendEmailInvitation({
          childName: childData.firstName,
          toEmail: normalizedEmail,
        });
      }
    }
  }

  // 2. Create the child document
  const childRef = doc(collection(db, "children"));
  const dateOfBirthTimestamp = Timestamp.fromDate(
    new Date(childData.dateOfBirth)
  );

  batch.set(childRef, {
    ...childData,
    dateOfBirth: dateOfBirthTimestamp,
    parentIds: parentUids, // Link the UIDs of the parents
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: adminId,
    updatedBy: adminId,
  });

  // 3. Update all linked parents with the new child's ID
  for (const uid of parentUids) {
    const userRef = doc(db, "users", uid);
    batch.update(userRef, {
      childrenIds: arrayUnion(childRef.id),
    });
  }

  // 4. Commit all operations atomically
  try {
    await batch.commit();
    return {
      id: childRef.id,
      ...childData,
      dateOfBirth: dateOfBirthTimestamp,
      parentIds: parentUids,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Child;
  } catch (error) {
    console.error("[children.service] Error creating child with batch:", error);
    throw new Error(
      "No se pudo crear el alumno y vincular a los padres. La operación fue revertida."
    );
  }
};

export const updateChild = async (
  childId: string,
  childData: Partial<ChildFormData>,
  adminId: string
): Promise<void> => {
  const batch = writeBatch(db);

  try {
    const childRef = doc(db, "children", childId);
    const childSnap = await getDoc(childRef);

    if (!childSnap.exists()) {
      throw new Error("El alumno no existe.");
    }

    const currentChildData = childSnap.data() as Child;
    const currentEmails = currentChildData.authorizedEmails || [];
    const newEmails = childData.authorizedEmails || [];

    // Identify newly added emails
    const addedEmails = newEmails.filter(
      (email) => !currentEmails.includes(email)
    );

    const newParentUids: string[] = [];

    // Process new emails
    for (const email of addedEmails) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await getUserByEmail(normalizedEmail);

      if (existingUser) {
        // User exists: update their roles and children
        console.log(`Linking child to existing user: ${email}`);
        const userRef = doc(db, "users", existingUser.uid);
        batch.update(userRef, {
          role: arrayUnion("parent"),
          childrenIds: arrayUnion(childId),
        });
        newParentUids.push(existingUser.uid);
      } else {
        // User does not exist: create a new user stub
        console.log(`Creating new parent invite for: ${email}`);
        const newUserRef = doc(collection(db, "users"));
        batch.set(newUserRef, {
          email: normalizedEmail,
          role: ["parent"],
          childrenIds: [childId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: adminId,
          updatedBy: adminId,
        });
        newParentUids.push(newUserRef.id);

        // Send invitarion
        await sendEmailInvitation({
          childName: childData.firstName || currentChildData.firstName,
          toEmail: normalizedEmail,
        });
      }
    }

    const { dateOfBirth, ...otherData } = childData;
    const updateData: Partial<Child> = {
      ...otherData,
      updatedAt: serverTimestamp() as Timestamp,
      updatedBy: adminId,
    };

    if (dateOfBirth) {
      updateData.dateOfBirth = Timestamp.fromDate(new Date(dateOfBirth));
    }

    if (newParentUids.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).parentIds = arrayUnion(...newParentUids);
    }

    batch.update(childRef, updateData);
    await batch.commit();
  } catch (error) {
    console.error("[children.service] Error updating child: ", error);
    throw new Error("No se pudo actualizar el alumno.");
  }
};

export const getChildrenByClassroomId = async (
  classroomId: string
): Promise<Child[]> => {
  if (!classroomId) return [];

  try {
    const q = query(
      childrenCollection,
      where("classroomId", "==", classroomId)
    );
    const querySnapshot = await getDocs(q);

    const children = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Child[];

    return children;
  } catch (error) {
    console.error("[children.service] Error getting children: ", error);
    throw new Error("No se pudieron obtener los niños de la sala.");
  }
};

export const getChildById = async (childId: string): Promise<Child | null> => {
  if (!childId) return null;

  try {
    const docRef = doc(db, "children", childId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Child;
    } else {
      console.warn(`[children.service] No child found with id: ${childId}`);
      return null;
    }
  } catch (error) {
    console.error("[children.service] Error getting child by ID: ", error);
    throw new Error("No se pudo obtener la información del alumno.");
  }
};

/**
 * Retrieves multiple children by their document IDs.
 * @param ids An array of child document IDs.
 * @returns A promise that resolves to an array of Child objects.
 * @param ids An array of child document IDs.
 * @returns A promise that resolves to an array of Child objects.
 */
export const getChildrenByIds = async (ids: string[]): Promise<Child[]> => {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    // Usamos el operador 'in' para obtener todos los documentos en una sola consulta
    const q = query(childrenCollection, where(documentId(), "in", ids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Child
    );
  } catch (error) {
    console.error("[children.service] Error getting children by IDs: ", error);
    throw new Error("No se pudo obtener la información de los niños.");
  }
};
