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
import { Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/lib/hooks";
import { Child, Event, Classroom } from "@/lib/types";
import {
  getChildrenByIds,
  getEventsByChildId,
  getClassroomById,
} from "@/lib/services";
import { EventTimelineItem } from "@/components/features";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { generateAvatarUrl } from "@/lib/utils";

export default function ParentDashboard() {
  const { user } = useAuth();

  const [allChildren, setAllChildren] = useState<Child[]>([]);

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Efecto para obtener la lista de todos los hijos del padre
  useEffect(() => {
    if (!user || !user.childrenIds || user.childrenIds.length === 0) {
      return;
    }

    const fetchChildren = async () => {
      try {
        const childrenData = await getChildrenByIds(user.childrenIds!);
        setAllChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id); // Seleccionar el primer hijo por defecto
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("No se pudo cargar la lista de niños.");
      }
    };

    fetchChildren();
  }, [user]);

  // Efecto para obtener los datos del hijo seleccionado (sala y eventos)
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

        setClassroom(classroomData);
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
    <main className="container mx-auto max-w-3xl p-4 md:p-8">
      {/* Selector de Niño (si hay más de uno) */}
      {allChildren.length > 1 && (
        <div className="mb-6 bg-white">
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

      {selectedChild && (
        <header className="mb-6 ml-2 flex items-center gap-4">
          <Avatar
            key={selectedChild.id}
            className="bg-lightning-yellow-600 text-white"
          >
            <AvatarImage src={generateAvatarUrl(selectedChild.avatarSeed)} />
            <AvatarFallback>
              {selectedChild.firstName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-shark-gray-900">
              {selectedChild.firstName} {selectedChild.lastName}
            </h1>
            <p className="capitalize text-shark-gray-500">
              {classroom?.name || ""}
            </p>
          </div>
        </header>
      )}

      {/* Date Navigator */}
      <div className="mb-6 rounded-lg border bg-white p-4">
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

      {isLoadingEvents ? (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-shark-gray-400" />
          <p className="text-shark-gray-500">Cargando eventos...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event) => (
            <EventTimelineItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
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
    </main>
  );
}
