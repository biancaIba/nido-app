"use client";

import { useEffect, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { toast } from "sonner";

import { User, Classroom } from "@/lib/types";
import { getTeachers, getClassrooms } from "@/lib/services"; // Usar getTeachers
import { AddEditTeacher, UserAvatar } from "@/components/features"; // Importar AddEditTeacher
import { Button } from "@/components/ui";

export default function MaestrosPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]); // Necesitamos las salas para el formulario
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Cargar maestros y salas en paralelo
        const [fetchedTeachers, fetchedClassrooms] = await Promise.all([
          getTeachers(),
          getClassrooms(),
        ]);
        setTeachers(fetchedTeachers);
        setClassrooms(fetchedClassrooms);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSuccess = (newTeacher: User) => {
    setTeachers((prev) => [...prev, newTeacher]);
    setIsAddingTeacher(false);
  };

  if (isAddingTeacher) {
    return (
      <AddEditTeacher
        onBack={() => setIsAddingTeacher(false)}
        onSaveSuccess={handleSaveSuccess}
        classrooms={classrooms} // Pasar las salas al formulario
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando maestros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shark-gray-50 pb-20">
      <div className="space-y-6 px-4 py-4">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div
              key={teacher.uid}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar user={teacher} size="sm" />
                  <div>
                    <h3 className="text-shark-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-shark-gray-900/60">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    /* TODO: Edit */
                  }}
                >
                  <Edit className="h-5 w-5 text-shark-gray-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay maestros registrados.
          </p>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddingTeacher(true)}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
