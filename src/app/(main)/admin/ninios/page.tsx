"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Child, Classroom, User } from "@/lib/types";
import { getAllChildren, getClassrooms } from "@/lib/services";
import {
  AddEditChild,
  UserAvatar,
  ManagementListSkeleton,
} from "@/components/features";
import { Button, EmptyState } from "@/components/ui";

export default function NiniosPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  // Create a lookup map for classroom names for efficient access
  const classroomNameMap = useMemo(() => {
    return new Map(classrooms.map((room) => [room.id, room.name]));
  }, [classrooms]);

  // Group children by classroomId
  const groupedChildren = useMemo(() => {
    const groups: { [classroomId: string]: Child[] } = {};
    for (const child of children) {
      const groupId = child.classroomId || "unassigned";
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(child);
    }
    return groups;
  }, [children]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedChildren, fetchedClassrooms] = await Promise.all([
          getAllChildren(),
          getClassrooms(),
        ]);
        setChildren(fetchedChildren);
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

  const handleSaveSuccess = (savedChild: Child) => {
    setChildren((prev) => {
      const exists = prev.some((c) => c.id === savedChild.id);
      if (exists) {
        return prev.map((c) => (c.id === savedChild.id ? savedChild : c));
      }
      return [...prev, savedChild];
    });
    setIsAddingChild(false);
    setEditingChild(null);
  };

  if (isLoading) {
    return <ManagementListSkeleton />;
  }

  if (isAddingChild || editingChild) {
    return (
      <AddEditChild
        onBack={() => {
          setIsAddingChild(false);
          setEditingChild(null);
        }}
        onSaveSuccess={handleSaveSuccess}
        classrooms={classrooms}
        initialData={editingChild || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-shark-gray-50 pb-20">
      {/* Grouped Children List */}
      <div className="space-y-6 px-4 py-4">
        {children.length === 0 ? (
          <EmptyState
            title="No hay niños registrados"
            description="Agrega niños al sistema para comenzar a gestionar sus actividades."
            icon={UserIcon}
          />
        ) : (
          Object.keys(groupedChildren).map((classroomId) => (
            <div key={classroomId}>
              <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                {classroomNameMap.get(classroomId) || "Sala no asignada"}
              </h2>
              <div className="space-y-3">
                {groupedChildren[classroomId].map((child) => (
                  <div
                    key={child.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={child as unknown as User} size="sm" />
                        <div>
                          <h3 className="text-shark-gray-900">
                            {child.firstName} {child.lastName}
                          </h3>
                          <p className="text-sm text-shark-gray-900/60">
                            {/* We can add more info here later, like age */}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setEditingChild(child)}>
                        <Edit className="h-5 w-5 text-shark-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsAddingChild(true)}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
