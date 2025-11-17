"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Child, Classroom } from "@/lib/types";
import { getAllChildren, getClassrooms } from "@/lib/services";
import { AddEditChild } from "@/components/features";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";

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
        console.log("Error fetching data:", error);
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
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-shark-gray-900">Niños</h1>
          <Button variant="secondary" onClick={() => setIsAddingChild(true)}>
            <Plus className="h-10 w-10" />
          </Button>
        </div>
      </div>

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
                      <Avatar
                        key={child.id}
                        className="bg-lightning-yellow-600 text-white"
                      >
                        <AvatarImage src={child.avatarUrl} />
                        <AvatarFallback>
                          {child.firstName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-shark-gray-900">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="text-sm text-shark-gray-900/60">
                          {/* We can add more info here later, like age */}
                        </p>
                      </div>
                    </div>
                    <Users className="h-5 w-5 text-shark-gray-900/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
