"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, Home, School, UsersRound as UsersRoundIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { RoleGuard } from "@/components/layout";

const navItems = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/salas", label: "Salas", icon: School },
  { href: "/admin/ninios", label: "Niños", icon: Baby },
  { href: "/admin/usuarios", label: "Usuarios", icon: UsersRoundIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RoleGuard requiredRole="admin">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 bg-shark-gray-50 pb-20">{children}</main>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg">
          <div className="flex items-center justify-around py-3">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
                    isActive
                      ? "text-lightning-yellow-600"
                      : "text-shark-gray-900/60"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
