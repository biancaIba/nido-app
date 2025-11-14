import { useState } from "react";
import { Plus, Home, School, Baby, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

import { Screen } from "@/lib/types/screen";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  classroom: string;
  avatar: string;
}

interface ManageChildrenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: string;
}

// Mock data
const MOCK_CHILDREN: Child[] = [
  {
    id: "1",
    firstName: "Sofía",
    lastName: "García",
    classroom: "Sala Sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  },
  {
    id: "2",
    firstName: "Lucas",
    lastName: "Martínez",
    classroom: "Sala Luna",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  },
  {
    id: "3",
    firstName: "Valentina",
    lastName: "López",
    classroom: "Sala Sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina",
  },
  {
    id: "4",
    firstName: "Mateo",
    lastName: "Rodríguez",
    classroom: "Sala Estrellas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo",
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Fernández",
    classroom: "Sala Sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: "6",
    firstName: "Benjamín",
    lastName: "Torres",
    classroom: "Sala Luna",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin",
  },
];

export function ManageChildren({ onNavigate, activeTab }: ManageChildrenProps) {
  const [children] = useState<Child[]>(MOCK_CHILDREN);

  // Group children by classroom
  const childrenByClassroom = children.reduce((acc, child) => {
    if (!acc[child.classroom]) {
      acc[child.classroom] = [];
    }
    acc[child.classroom].push(child);
    return acc;
  }, {} as Record<string, Child[]>);

  return (
    <div className="min-h-screen bg-[--shark-gray-50] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-[--shark-gray-900]">Children</h1>
          <p className="text-sm text-[--shark-gray-900]/60">
            {children.length} alumnos registrados
          </p>
        </div>
      </div>

      {/* Children List grouped by classroom */}
      <div className="py-4">
        {Object.entries(childrenByClassroom).map(
          ([classroom, classroomChildren]) => (
            <div key={classroom} className="mb-6">
              <div className="px-4 mb-3">
                <h3 className="text-[--shark-gray-900]/60">{classroom}</h3>
              </div>
              <div className="space-y-2">
                {classroomChildren.map((child) => (
                  <div
                    key={child.id}
                    className="bg-white px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onNavigate("edit-child")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={child.avatar}
                            alt={child.firstName}
                          />
                          <AvatarFallback>
                            {child.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-[--shark-gray-900]">
                            {child.firstName} {child.lastName}
                          </h4>
                          <p className="text-sm text-[--shark-gray-900]/60">
                            {child.classroom}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[--shark-gray-900]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => onNavigate("add-child")}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-[--sea-green-500] text-white shadow-lg hover:bg-[--sea-green-500]/90 flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </button>

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
