/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  format,
  isToday,
  isYesterday,
  addDays,
  startOfDay as startOfDate,
} from "date-fns";
import { es } from "date-fns/locale";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/lib/hooks";
import { Child, Event, Classroom } from "@/lib/types";
import {
  getChildrenByClassroomId,
  getEventsByChildId,
  getClassrooms,
} from "@/lib/services";
import {
  EventTimelineItem,
  TeacherDashboardSkeleton,
} from "@/components/features";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export default function MaestroBitacora() {
  const { user } = useAuth();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allChildren, setAllChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch the teacher's assigned classrooms
  useEffect(() => {
    if (!user?.teacherProfile?.classroomIds) {
      // If the user is not a teacher or has no classrooms, do nothing.
      // We might set an error or an empty state here in the future.
      if (user) setIsLoading(false); // Stop loading if user is loaded but not a teacher
      return;
    }

    const fetchClassrooms = async () => {
      try {
        const allClassrooms = await getClassrooms();
        const teacherClassroomIds = new Set(user.teacherProfile!.classroomIds);
        const assignedClassrooms = allClassrooms.filter((room) =>
          teacherClassroomIds.has(room.id)
        );

        setClassrooms(assignedClassrooms);
        if (assignedClassrooms.length > 0) {
          setSelectedClassroom(assignedClassrooms[0].id);
        } else {
          // No classrooms assigned, stop loading and show empty state.
          setIsLoading(false);
        }
      } catch (error) {
        setError("No se pudieron cargar las salas asignadas.");
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, [user]);

  // Effect 2: Fetch children when a classroom is selected
  useEffect(() => {
    if (!selectedClassroom) {
      setAllChildren([]);
      setSelectedChildId(null);
      setEvents([]);
      return;
    }

    const fetchChildren = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const childrenData = await getChildrenByClassroomId(selectedClassroom);
        setAllChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        } else {
          // No children in this classroom, clear events and stop loading.
          setSelectedChildId(null);
          setEvents([]);
          setIsLoading(false);
        }
      } catch (error) {
        setError("No se pudo cargar la lista de niños de la sala.");
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [selectedClassroom]);

  // Effect 3: Fetch events when a child or date is selected
  useEffect(() => {
    if (!selectedChildId) {
      // If no child is selected (e.g., empty classroom), ensure loading is false.
      if (allChildren.length === 0) setIsLoading(false);
      return;
    }

    const fetchDataForChild = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventsData = await getEventsByChildId(
          selectedChildId,
          selectedDate
        );
        setEvents(eventsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar la bitácora."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataForChild();
  }, [selectedChildId, selectedDate, allChildren]);

  const selectedChild = useMemo(
    () => allChildren.find((c) => c.id === selectedChildId),
    [allChildren, selectedChildId]
  );

  const handlePreviousDay = () => setSelectedDate((d) => addDays(d, -1));
  const handleNextDay = () => setSelectedDate((d) => addDays(d, 1));

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) return "Hoy";
    if (isYesterday(date)) return "Ayer";
    return format(date, "EEEE", { locale: es });
  };

  const isNextDayDisabled = isToday(startOfDate(selectedDate));

  const hasContent = classrooms.length > 0 && allChildren.length > 0;

  return (
    <>
      {/* Classroom Selector */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 shadow-sm mb-4">
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

      {isLoading ? (
        <TeacherDashboardSkeleton />
      ) : error ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <FileText className="h-12 w-12 text-shark-gray-300" />
          <h3 className="text-lg font-semibold text-shark-gray-700">
            No hay niños en tus salas
          </h3>
          <p className="text-sm text-shark-gray-500">
            No se han encontrado salas o niños asignados a tu perfil.
          </p>
        </div>
      ) : (
        <>
          {/* Date Navigator */}
          <div className="rounded-lg border-b bg-white p-4 mb-2">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousDay}
                className="h-10 w-10 shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 text-center">
                <p className="font-semibold capitalize text-shark-gray-900">
                  {formatDateHeader(selectedDate)}
                </p>
                <p className="text-sm text-shark-gray-500">
                  {format(selectedDate, "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextDay}
                disabled={isNextDayDisabled}
                className="h-10 w-10 shrink-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Child Selector */}
          {allChildren.length > 1 && (
            <div className="mb-2 px-4 bg-white">
              <Select
                value={selectedChildId ?? ""}
                onValueChange={(value) => setSelectedChildId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un niño/a" />
                </SelectTrigger>
                <SelectContent>
                  {allChildren.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Events Timeline */}
          {events.length > 0 ? (
            <div className="space-y-2 px-4">
              {events.map((event) => (
                <EventTimelineItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <FileText className="h-12 w-12 text-shark-gray-300" />
              <h3 className="text-lg font-semibold text-shark-gray-700">
                No hay eventos este día
              </h3>
              <p className="text-sm text-shark-gray-500">
                No se ha registrado ninguna actividad para{" "}
                {selectedChild?.firstName} en la fecha seleccionada.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
