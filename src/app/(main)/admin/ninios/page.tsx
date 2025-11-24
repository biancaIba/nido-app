"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { toast } from "sonner";

import { Child, Classroom, User } from "@/lib/types";
import { getAllChildren, getClassrooms } from "@/lib/services";
import { AddEditChild, UserAvatar } from "@/components/features";
import { Button } from "@/components/ui";

export default function NiniosPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingChild, setIsAddingChild] = useState(false);

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

  const handleSaveSuccess = (newChild: Child) => {
    setChildren((prev) => [...prev, newChild]);
    setIsAddingChild(false);
  };

  if (isAddingChild) {
    return (
      <AddEditChild
        onBack={() => setIsAddingChild(false)}
        onSaveSuccess={handleSaveSuccess}
        classrooms={classrooms}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando niños...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shark-gray-50 pb-20">
      {/* Grouped Children List */}
      <div className="space-y-6 px-4 py-4">
        {Object.keys(groupedChildren).map((classroomId) => (
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
                    <button
                      onClick={() => {
                        /* TODO: Implement edit functionality */
                      }}
                    >
                      <Edit className="h-5 w-5 text-shark-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
