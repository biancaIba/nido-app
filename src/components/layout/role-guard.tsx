"use client";

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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-shark-gray-400" />
      </div>
    );
  }

  if (!user) {
    // If loading is finished and there's no user, redirect to sign-in.
    router.replace("/ingresar");
    return null; // Return null to prevent rendering children
  }

  if (!user.role.includes(requiredRole)) {
    // If user does not have the required role, redirect to a safe page.
    // We can determine a safe default route based on their primary role.
    const safePath = user.role.includes("admin")
      ? "/admin"
      : user.role.includes("teacher")
      ? "/maestro"
      : "/tutor";
    router.replace(safePath);
    return null; // Return null to prevent rendering children
  }

  // If user is authenticated and has the required role, render the children.
  return <>{children}</>;
}
