"use client";

import { LogoNido } from "@/components/features";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b py-3 bg-white shadow-sm">
      <div className="flex items-center justify-center font-semibold text-lg text-shark-gray-900">
        <LogoNido className="h-10 w-10" />
        <h1 className="ml-1 text-2xl">Nido</h1>
      </div>
    </header>
  );
}
