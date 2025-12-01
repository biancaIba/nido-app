"use client";

import { useEffect, useState } from "react";
import { Edit, Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner";

import { User, Classroom } from "@/lib/types";
import { getTeachers, getClassrooms } from "@/lib/services";
import {
  AddEditTeacher,
  UserAvatar,
  ManagementListSkeleton,
} from "@/components/features";
import { Button, EmptyState } from "@/components/ui";

export default function MaestrosPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);

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

  const handleSaveSuccess = (savedTeacher: User) => {
    setTeachers((prev) => {
      const exists = prev.some((t) => t.uid === savedTeacher.uid);
      if (exists) {
        return prev.map((t) => (t.uid === savedTeacher.uid ? savedTeacher : t));
      }
      return [...prev, savedTeacher];
    });
    setIsAddingTeacher(false);
    setEditingTeacher(null);
  };

  if (isLoading) {
    return <ManagementListSkeleton />;
  }

  if (isAddingTeacher || editingTeacher) {
    return (
      <AddEditTeacher
        onBack={() => {
          setIsAddingTeacher(false);
          setEditingTeacher(null);
        }}
        onSaveSuccess={handleSaveSuccess}
        classrooms={classrooms} // Pasar las salas al formulario
        initialData={editingTeacher || undefined}
      />
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
                <button onClick={() => setEditingTeacher(teacher)}>
                  <Edit className="h-5 w-5 text-shark-gray-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No hay maestros registrados"
            description="Invita a los maestros para que puedan gestionar sus salas y actividades."
            icon={GraduationCap}
          />
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
