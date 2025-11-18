"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageSearch, User } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tutor/bitacora", label: "Bitácora", icon: PackageSearch },
  { href: "/tutor/perfil", label: "Perfil", icon: User },
];

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // todo: add active state to the icons based on the current pathname

  return (
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
                className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
                  pathname === href
                    ? "text-lightning-yellow-600"
                    : "text-shark-gray-900/60"
                }`}
              >
                <Icon className={cn("h-6 w-6", isActive && "h-8 w-8")} />
                <span className="text-sm">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
