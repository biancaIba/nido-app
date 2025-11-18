/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Users, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Child, Classroom } from "@/lib/types";
import {
  getClassrooms,
  getChildrenByClassroomId,
  createEvents,
} from "@/lib/services";
import { ChildCard, EventFormPayload, EventModal } from "@/components/features";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export default function TeacherDashboard() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<Set<string>>(
    new Set()
  );

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true);
        const fetchedClassrooms = await getClassrooms();
        setClassrooms(fetchedClassrooms);
        if (fetchedClassrooms.length > 0) {
          setSelectedClassroom(fetchedClassrooms[0].id);
        }
      } catch (error) {
        setError("No se pudieron cargar las salas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (!selectedClassroom) {
      setChildren([]);
      return;
    }
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedChildren = await getChildrenByClassroomId(
          selectedClassroom
        );
        setChildren(fetchedChildren);
      } catch (error) {
        setError("No se pudieron cargar los alumnos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, [selectedClassroom]);

  const handleChildClick = (child: Child) => {
    if (selectionMode) {
      // Toggle selection in group mode
      const newSelected = new Set(selectedChildren);
      if (newSelected.has(child.id)) {
        newSelected.delete(child.id);
      } else {
        newSelected.add(child.id);
      }
      setSelectedChildren(newSelected);
    } else {
      // Open modal for individual event
      setSelectedChildren(new Set([child.id]));
      setIsModalOpen(true);
    }
  };

  const handleGroupEventClick = () => {
    if (selectionMode) {
      // Cancel selection mode
      setSelectionMode(false);
      setSelectedChildren(new Set());
    } else {
      // Start selection mode
      setSelectionMode(true);
    }
  };

  const handleGroupEventSubmit = () => {
    if (selectedChildren.size === 0) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (!selectionMode) {
      setSelectedChildren(new Set());
    }
  };

  const handleEventSubmit = async (eventData: EventFormPayload) => {
    if (!user?.uid) {
      return;
    }

    if (selectedChildren.size === 0) {
      return;
    }

    try {
      // Convert the form data to the service payload
      const payload = {
        category: eventData.category,
        details: eventData.details,
        eventTime: eventData.eventTime,
      };

      // Call the service with the array of child IDs
      const result = await createEvents(
        payload,
        Array.from(selectedChildren),
        user.uid
      );

      if (result.success) {
        toast.success("Evento creado exitosamente.");

        // Reset state
        if (selectionMode) {
          setSelectionMode(false);
        }
        setSelectedChildren(new Set());
        setIsModalOpen(false);

        // Refresh the children list to show updated lastEvent
        if (selectedClassroom) {
          const fetchedChildren = await getChildrenByClassroomId(
            selectedClassroom
          );
          setChildren(fetchedChildren);
        }
      } else {
        console.error("Error creating event:", result);
      }
    } catch (error) {
      toast.error("Error creando evento.");
    }
  };

  // Get selected children objects
  const selectedChildrenData = children.filter((child) =>
    selectedChildren.has(child.id)
  );

  if (isLoading && classrooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-shark-gray-500">Cargando...</p>
      </div>
    );
  }

  if (error && classrooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Classroom Selector */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 shadow-sm">
        <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Seleccionar sala" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Group Event Button */}
      <div className="sticky top-14 z-30 px-4 pt-4 pb-2 bg-shark-gray-50">
        <Button
          onClick={handleGroupEventClick}
          className={`w-full h-10 ${
            selectionMode
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-lightning-yellow-600 hover:bg-lightning-yellow-600/90"
          } text-white gap-2`}
        >
          {selectionMode ? (
            <>
              <X className="h-5 w-5" />
              Cancelar Selección
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              Evento Grupal
            </>
          )}
        </Button>
      </div>

      {/* Child Grid */}
      <div className={cn("px-4 py-4", selectionMode && "mb-30")}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              isSelected={selectedChildren.has(child.id)}
              selectionMode={selectionMode}
              onClick={() => handleChildClick(child)}
            />
          ))}
        </div>
      </div>

      {/* Group Event Action Bar */}
      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-shark-gray-900">
              {selectedChildren.size} de {children.length} seleccionados
            </span>
          </div>
          <Button
            onClick={handleGroupEventSubmit}
            disabled={selectedChildren.size === 0}
            className="w-full h-12 bg-lightning-yellow-600 hover:bg-lightning-yellow-600/90 text-white"
          >
            Cargar Evento para {selectedChildren.size} Alumnos
          </Button>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleEventSubmit}
      />
    </>
  );
}
