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
        router.replace("/teacher/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-lg font-medium text-blue-violet-600">
        Verificando sesión...
      </p>
    </main>
  );
}
