"use client";

import { useEffect, useState } from "react";
import { Plus, School, Edit } from "lucide-react";
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
  EmptyState,
} from "@/components/ui";
import { Classroom, Child } from "@/lib/types";
import {
  createClassroom,
  getClassrooms,
  getAllChildren,
  updateClassroom,
} from "@/lib/services";
import { useAuth } from "@/lib/hooks";
import { ManagementListSkeleton } from "@/components/features";

export default function SalasPage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedClassrooms, fetchedChildren] = await Promise.all([
          getClassrooms(),
          getAllChildren(),
        ]);
        setClassrooms(fetchedClassrooms);
        setChildren(fetchedChildren);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <ManagementListSkeleton />;
  }

  const studentCounts = children.reduce(
    (acc, child) => {
      const classroomId = child.classroomId || "unassigned";
      acc[classroomId] = (acc[classroomId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleSaveClassroom = async () => {
    if (!newClassroomName.trim() || !user?.uid) {
      toast.error("Por favor ingresa un nombre para la sala.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingClassroom) {
        await updateClassroom(editingClassroom.id, newClassroomName, user.uid);
        setClassrooms((prev) =>
          prev.map((c) =>
            c.id === editingClassroom.id ? { ...c, name: newClassroomName } : c
          )
        );
        toast.success(`Sala "${newClassroomName}" actualizada exitosamente.`);
      } else {
        const newClassroom = await createClassroom(newClassroomName, user.uid);
        setClassrooms((prev) => [...prev, newClassroom]);
        toast.success(`Sala "${newClassroomName}" creada exitosamente.`);
      }
      setNewClassroomName("");
      setEditingClassroom(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar la sala.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setNewClassroomName(classroom.name);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-shark-gray-50 pb-20">
      {/* Classrooms List */}
      <div className="space-y-3 px-4 py-4">
        {classrooms.length === 0 ? (
          <EmptyState
            title="No hay salas creadas"
            description="Crea tu primera sala para comenzar a asignar niños y maestros."
            icon={School}
          />
        ) : (
          classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightning-yellow-600/10">
                    <School className="h-6 w-6 text-lightning-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-shark-gray-900">{classroom.name}</h3>
                    <p className="text-sm text-shark-gray-900/60">
                      {studentCounts[classroom.id] || 0} niños
                    </p>
                  </div>
                </div>
                <button onClick={() => openEditDialog(classroom)}>
                  <Edit className="h-5 w-5 text-shark-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => {
          setEditingClassroom(null);
          setNewClassroomName("");
          setIsDialogOpen(true);
        }}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add/Edit Classroom Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingClassroom ? "Editar Sala" : "Nueva Sala"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="classroom-name" className="mb-2 block">
              Nombre de la Sala
            </Label>
            <Input
              id="classroom-name"
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
              placeholder="Sala Arcoíris"
              className="w-full"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewClassroomName("");
                setEditingClassroom(null);
              }}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveClassroom} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
