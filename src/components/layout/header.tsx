"use client";

import { useState } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Menu, Home, Settings, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Página Principal", href: "#" },
    { icon: Settings, label: "Configuración", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <SheetPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <SheetPrimitive.Trigger asChild>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6 text-shark-gray-900" />
            </button>
          </SheetPrimitive.Trigger>
          <SheetPrimitive.Portal>
            <SheetPrimitive.Overlay
              className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/50"
              )}
            />
            <SheetPrimitive.Content
              className={cn(
                "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-[100] flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-[280px] border-r sm:w-[320px]"
              )}
              aria-describedby={undefined}
            >
              <div className="flex flex-col gap-1.5 p-6 border-b">
                <SheetPrimitive.Title className="flex items-center gap-2">
                  Nido
                </SheetPrimitive.Title>
              </div>

              <nav className="flex flex-col gap-2 px-4">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-shark-gray-900" />
                    <span className="text-shark-gray-900">{item.label}</span>
                  </a>
                ))}
              </nav>

              <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </SheetPrimitive.Close>
            </SheetPrimitive.Content>
          </SheetPrimitive.Portal>
        </SheetPrimitive.Root>

        <div className="flex items-center gap-2">
          <h1>Nido</h1>
        </div>

        {/* Spacer to keep logo centered */}
        <div className="w-10"></div>
      </div>
    </header>
  );
}
