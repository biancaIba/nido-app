"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseAuthUser,
} from "firebase/auth";
import { Loader2 } from "lucide-react";

import { auth } from "@/config";
import { getUserById } from "@/lib/services";
import { User as AppUser } from "@/lib/types";

interface AuthContextType {
  user: AppUser | null;
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
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseAuthUser | null) => {
        if (firebaseUser) {
          // User is signed in, now fetch their full profile from Firestore.
          const userProfile = await getUserById(firebaseUser.uid);
          setUser(userProfile);
        } else {
          // User is signed out.
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: unknown) => {
    if (error instanceof Error) {
      setAuthError(error.message);
    } else {
      setAuthError("An unknown error occurred.");
    }
    console.error(error);
  };

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthError(null);
    } catch (error) {
      handleAuthError(error);
    }
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setAuthError(null);
        return userCredential.user;
      } catch (error) {
        handleAuthError(error);
        return null;
      }
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // TODO: Aquí es un buen lugar para agregar el usuario a Firestore
        // The onAuthStateChanged listener will fire, but the user might not be in the DB yet.
        // We need to call createUserInDb from the sign-up page *after* this function succeeds.

        setAuthError(null);
        return userCredential.user;
      } catch (error) {
        handleAuthError(error);
        return null;
      }
    },
    []
  );

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (error) {
      handleAuthError(error);
    }
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logOut,
    signInWithEmail,
    signUpWithEmail,
    authError,
    clearAuthError,
  };

  // Show a global loader while we are verifying the user session.
  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-shark-gray-400" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
