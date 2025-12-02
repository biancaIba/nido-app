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
  EventTimelineSkeleton,
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

  // Granular loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChildrenLoading, setIsChildrenLoading] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch the teacher's assigned classrooms (runs once)
  useEffect(() => {
    if (!user) return;

    const fetchClassrooms = async () => {
      if (!user.teacherProfile?.classroomIds) {
        setIsInitialLoading(false);
        return;
      }
      try {
        const allClassrooms = await getClassrooms();
        const teacherClassroomIds = new Set(user.teacherProfile.classroomIds);
        const assignedClassrooms = allClassrooms.filter((room) =>
          teacherClassroomIds.has(room.id)
        );

        setClassrooms(assignedClassrooms);
        if (assignedClassrooms.length > 0) {
          setSelectedClassroom(assignedClassrooms[0].id);
        } else {
          // No classrooms assigned, initial load is finished.
          setIsInitialLoading(false);
        }
      } catch (error) {
        setError("No se pudieron cargar las salas asignadas.");
        setIsInitialLoading(false);
      }
    };
    fetchClassrooms();
  }, [user]);

  // Effect 2: Fetch children when a classroom is selected
  useEffect(() => {
    if (!selectedClassroom) {
      return;
    }

    const fetchChildren = async () => {
      setIsChildrenLoading(true);
      setAllChildren([]); // Clear previous children to ensure loading state shows
      setSelectedChildId(null);
      setEvents([]);
      setError(null);

      try {
        const childrenData = await getChildrenByClassroomId(selectedClassroom);
        setAllChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        } else {
          // No children in this classroom, stop the loading sequence.
          if (isInitialLoading) setIsInitialLoading(false);
        }
      } catch (error) {
        setError("No se pudo cargar la lista de niños de la sala.");
        if (isInitialLoading) setIsInitialLoading(false);
      } finally {
        setIsChildrenLoading(false);
      }
    };

    fetchChildren();
  }, [selectedClassroom, isInitialLoading]);

  // Effect 3: Fetch events when a child or date is selected
  useEffect(() => {
    if (!selectedChildId) {
      // If no child is selected (e.g., empty classroom), ensure events are clear.
      setEvents([]);
      return;
    }

    const fetchDataForChild = async () => {
      setIsEventsLoading(true);
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
        setIsEventsLoading(false);
        // This is the final step of the initial load sequence.
        if (isInitialLoading) setIsInitialLoading(false);
      }
    };

    fetchDataForChild();
  }, [selectedChildId, selectedDate, isInitialLoading]);

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

  return (
    <>
      {isInitialLoading ? (
        <TeacherDashboardSkeleton />
      ) : error ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : classrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <FileText className="h-12 w-12 text-shark-gray-300" />
          <h3 className="text-lg font-semibold text-shark-gray-700">
            No tienes salas asignadas
          </h3>
          <p className="text-sm text-shark-gray-500">
            Contacta a un administrador para que te asigne a una o más salas.
          </p>
        </div>
      ) : (
        <>
          {/* Classroom Selector */}
          <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 shadow-sm mb-4">
            <Select
              value={selectedClassroom}
              onValueChange={setSelectedClassroom}
            >
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

          {isChildrenLoading ? (
            <EventTimelineSkeleton />
          ) : allChildren.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <FileText className="h-12 w-12 text-shark-gray-300" />
              <h3 className="text-lg font-semibold text-shark-gray-700">
                No hay niños en esta sala
              </h3>
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
              {isEventsLoading ? (
                <EventTimelineSkeleton />
              ) : events.length > 0 ? (
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
      )}
    </>
  );
}
