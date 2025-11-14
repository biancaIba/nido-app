import { Home, School, Baby } from "lucide-react";

import { Card } from "@/components/ui";
import { Screen } from "@/config";

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
  activeTab: string;
}

export function AdminDashboard({ onNavigate, activeTab }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-[--shark-gray-50]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-[--shark-gray-900]">Admin Panel</h1>
          <p className="text-sm text-[--shark-gray-900]/60">Gestión de Nido</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="px-4 py-6 space-y-4">
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[--blue-violet-500]"
          onClick={() => onNavigate("classrooms")}
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[--blue-violet-500]/10 flex items-center justify-center">
              <School className="h-7 w-7 text-[--blue-violet-500]" />
            </div>
            <div>
              <h3 className="text-[--shark-gray-900]">Manage Classrooms</h3>
              <p className="text-sm text-[--shark-gray-900]/60">
                Ver y editar salas
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-[--blue-violet-500]"
          onClick={() => onNavigate("children")}
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[--sea-green-500]/10 flex items-center justify-center">
              <Baby className="h-7 w-7 text-[--sea-green-500]" />
            </div>
            <div>
              <h3 className="text-[--shark-gray-900]">Manage Children</h3>
              <p className="text-sm text-[--shark-gray-900]/60">
                Ver y editar alumnos
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => onNavigate("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "home"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => onNavigate("classrooms")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "classrooms"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <School className="h-6 w-6" />
            <span className="text-xs">Classrooms</span>
          </button>

          <button
            onClick={() => onNavigate("children")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "children"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <Baby className="h-6 w-6" />
            <span className="text-xs">Children</span>
          </button>
        </div>
      </div>
    </div>
  );
}
