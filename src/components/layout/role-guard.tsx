"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/hooks";
import { UserRole } from "@/lib/types";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/ingresar");
      } else if (!user.role.includes(requiredRole)) {
        const safePath = user.role.includes("admin")
          ? "/admin"
          : user.role.includes("teacher")
            ? "/maestro/eventos"
            : "/tutor/bitacora";
        router.replace(safePath);
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-shark-gray-400" />
      </div>
    );
  }

  if (!user || !user.role.includes(requiredRole)) {
    return null;
  }

  // If user is authenticated and has the required role, render the children.
  return <>{children}</>;
}
