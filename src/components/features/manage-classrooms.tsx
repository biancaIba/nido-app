import { useState } from "react";
import { Plus, School, Users, Home, Baby } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
} from "@/components/ui";

import { Screen } from "@/lib/types/screen";

interface Classroom {
  id: string;
  name: string;
  studentCount: number;
}

interface ManageClassroomsProps {
  onNavigate: (screen: Screen) => void;
  activeTab: string;
}

// Mock data
const MOCK_CLASSROOMS: Classroom[] = [
  { id: "1", name: "Sala Sol", studentCount: 12 },
  { id: "2", name: "Sala Luna", studentCount: 10 },
  { id: "3", name: "Sala Estrellas", studentCount: 15 },
  { id: "4", name: "Sala 2024 - Turno Mañana", studentCount: 8 },
];

export function ManageClassrooms({
  onNavigate,
  activeTab,
}: ManageClassroomsProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState("");

  const handleAddClassroom = () => {
    if (!newClassroomName.trim()) {
      toast.error("Por favor ingresa un nombre para la sala");
      return;
    }

    const newClassroom: Classroom = {
      id: String(classrooms.length + 1),
      name: newClassroomName,
      studentCount: 0,
    };

    setClassrooms([...classrooms, newClassroom]);
    setNewClassroomName("");
    setIsDialogOpen(false);
    toast.success(`Sala "${newClassroomName}" creada exitosamente`);
  };

  return (
    <div className="min-h-screen bg-[--shark-gray-50] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-[--shark-gray-900]">Classrooms</h1>
          <p className="text-sm text-[--shark-gray-900]/60">
            {classrooms.length} salas registradas
          </p>
        </div>
      </div>

      {/* Classrooms List */}
      <div className="px-4 py-4 space-y-3">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[--blue-violet-500]/10 flex items-center justify-center">
                  <School className="h-6 w-6 text-[--blue-violet-500]" />
                </div>
                <div>
                  <h3 className="text-[--shark-gray-900]">{classroom.name}</h3>
                  <p className="text-sm text-[--shark-gray-900]/60">
                    {classroom.studentCount} alumnos
                  </p>
                </div>
              </div>
              <Users className="h-5 w-5 text-[--shark-gray-900]/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-[--blue-violet-500] text-white shadow-lg hover:bg-[--blue-violet-500]/90 flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Classroom Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>New Classroom</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="classroom-name" className="mb-2 block">
              Classroom Name
            </Label>
            <Input
              id="classroom-name"
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
              placeholder="e.g., Sala Arcoíris"
              className="w-full"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewClassroomName("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClassroom}
              className="flex-1 bg-[--blue-violet-500] hover:bg-[--blue-violet-500]/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
