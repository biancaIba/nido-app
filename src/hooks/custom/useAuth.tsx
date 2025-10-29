"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { auth } from "@/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string) => Promise<User | null>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
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
  ): Promise<User | null> => {
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
  ): Promise<User | null> => {
    setAuthError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // TODO: Aquí es un buen lugar para agregar el usuario a Firestore

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
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
