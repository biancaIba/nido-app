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
  getChildrenByIds,
  getEventsByChildId,
  getClassroomById,
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

  const [selectedClassroom, setSelectedClassroom] = useState<string>("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allChildren, setAllChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const fetchedClassrooms = await getClassrooms();
        setClassrooms(fetchedClassrooms);
        if (fetchedClassrooms.length > 0) {
          setSelectedClassroom(fetchedClassrooms[0].id);
        }
      } catch (error) {
        setError("No se pudieron cargar las salas.");
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    if (!user || !user.childrenIds || user.childrenIds.length === 0) {
      return;
    }

    const fetchChildren = async () => {
      try {
        const childrenData = await getChildrenByIds(user.childrenIds!);
        setAllChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        }
      } catch (error) {
        setError("No se pudo cargar la lista de niños.");
      }
    };

    fetchChildren();
  }, [user]);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchDataForChild = async () => {
      try {
        setIsLoadingEvents(true);
        setError(null);
        const child = allChildren.find((c) => c.id === selectedChildId);
        if (!child) return;

        const [classroomData, eventsData] = await Promise.all([
          getClassroomById(child.classroomId),
          getEventsByChildId(selectedChildId, selectedDate),
        ]);

        setClassrooms([classroomData as Classroom]);
        setEvents(eventsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la información."
        );
      } finally {
        setIsLoadingEvents(false);
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
              {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
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

      {/* Selector de Niño (si hay más de uno) */}
      {allChildren.length > 1 && (
        <div className="mb-2 px-4 bg-white">
          <Select
            value={selectedChildId ?? ""}
            onValueChange={setSelectedChildId}
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

      {isLoadingEvents ? (
        <TeacherDashboardSkeleton />
      ) : error ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
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
  );
}
