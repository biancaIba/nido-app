"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, Home, School, UsersRound as UsersRoundIcon } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/salas", label: "Salas", icon: School },
  { href: "/admin/ninios", label: "Niños", icon: Baby },
  { href: "/admin/personal", label: "Personal", icon: UsersRoundIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-shark-gray-50 pb-20">{children}</main>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg">
        <div className="flex items-center justify-around py-3">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
                pathname === href
                  ? "text-lightning-yellow-600"
                  : "text-shark-gray-900/60"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
