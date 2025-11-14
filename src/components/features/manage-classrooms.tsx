"use client";

import { useEffect, useState } from "react";
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
import { Screen } from "@/config";
import { Classroom } from "@/lib/types";
import { createClassroom, getClassrooms } from "@/lib/services";
import { useAuth } from "@/lib/hooks";

interface ManageClassroomsProps {
  onNavigate: (screen: Screen) => void;
  activeTab: string;
}

export function ManageClassrooms({
  onNavigate,
  activeTab,
}: ManageClassroomsProps) {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true);
        const fetchedClassrooms = await getClassrooms();
        setClassrooms(fetchedClassrooms);
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar las salas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  const handleAddClassroom = async () => {
    if (!newClassroomName.trim() || !user?.uid) {
      toast.error("Por favor ingresa un nombre para la sala.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newClassroom = await createClassroom(newClassroomName, user.uid);
      setClassrooms((prev) => [...prev, newClassroom]);
      setNewClassroomName("");
      setIsDialogOpen(false);
      toast.success(`Sala "${newClassroomName}" creada exitosamente.`);
    } catch (error) {
      console.log(error);
      toast.error("No se pudo crear la sala.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando salas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--shark-gray-50] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-[--shark-gray-900]">Salas</h1>
        </div>
      </div>

      {/* Classrooms List */}
      <div className="space-y-3 px-4 py-4">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[--blue-violet-500]/10">
                  <School className="h-6 w-6 text-[--blue-violet-500]" />
                </div>
                <div>
                  <h3 className="text-[--shark-gray-900]">{classroom.name}</h3>
                  <p className="text-sm text-[--shark-gray-900]/60">
                    {/* TODO: Implement student count */}0 alumnos
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
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[--blue-violet-500] text-white shadow-lg transition-all hover:scale-110 hover:bg-[--blue-violet-500]/90"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Classroom Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Sala</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="classroom-name" className="mb-2 block">
              Nombre de la Sala
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddClassroom}
              className="flex-1 bg-[--blue-violet-500] hover:bg-[--blue-violet-500]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => onNavigate("home")}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
              activeTab === "home"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Inicio</span>
          </button>

          <button
            onClick={() => onNavigate("classrooms")}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
              activeTab === "classrooms"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <School className="h-6 w-6" />
            <span className="text-xs">Salas</span>
          </button>

          <button
            onClick={() => onNavigate("children")}
            className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
              activeTab === "children"
                ? "text-[--blue-violet-500]"
                : "text-[--shark-gray-900]/60"
            }`}
          >
            <Baby className="h-6 w-6" />
            <span className="text-xs">Niños</span>
          </button>
        </div>
      </div>
    </div>
  );
}
