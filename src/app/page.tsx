"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

export default function RootGuardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/maestro/eventos");
      } else {
        router.replace("/ingresar");
      }
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-lg font-medium">Verificando sesión...</p>
    </main>
  );
}
