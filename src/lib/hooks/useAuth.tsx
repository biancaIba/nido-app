"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseAuthUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { auth } from "@/config/index";
import { getUserById } from "@/lib/services";
import type { User as AppUser } from "@/lib/types"; // Import our custom User type

interface AuthContextType {
  user: AppUser | null; // Use our custom AppUser type
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<FirebaseAuthUser | null>;
  signUpWithEmail: (
    email: string,
    password: string
  ) => Promise<FirebaseAuthUser | null>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAuthError("Error al iniciar sesión con Google. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<FirebaseAuthUser | null> => {
    setAuthError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      const firebaseError = error as AuthError;
      console.error(
        "Error signing in with Email/Password:",
        firebaseError.message
      );

      let errorMessage =
        "Credenciales incorrectas. Verifique email y contraseña.";
      if (firebaseError.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este email.";
      } else if (firebaseError.code === "auth/wrong-password") {
        errorMessage = "La contraseña es incorrecta.";
      }
      setAuthError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<FirebaseAuthUser | null> => {
    setAuthError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // TODO: Aquí es un buen lugar para agregar el usuario a Firestore
      // The onAuthStateChanged listener will fire, but the user might not be in the DB yet.
      // We need to call createUserInDb from the sign-up page *after* this function succeeds.

      return userCredential.user;
    } catch (error) {
      const firebaseError = error as AuthError;
      console.error(
        "Error signing up with Email/Password:",
        firebaseError.message
      );

      let errorMessage =
        "Error al crear la cuenta. Intente con otro email o contraseña más segura.";
      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage = "El email ya está registrado.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "El formato del email no es válido.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      }
      setAuthError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  // This effect now handles fetching the user profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile from Firestore
        setLoading(true);
        const userProfile = await getUserById(firebaseUser.uid);
        setUser(userProfile); // Set our custom user object
        setLoading(false);
      } else {
        // User is signed out
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logOut,
    signInWithEmail,
    signUpWithEmail,
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
