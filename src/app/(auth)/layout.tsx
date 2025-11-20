"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/maestro/eventos");
    }
  }, [user, loading, router]);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-shark-gray-50">{children}</main>
    </div>
  );
}
