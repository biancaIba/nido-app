"use client";

import { useEffect, useState } from "react";
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
import { Child, Event } from "@/lib/types";
import { getChildById, getEventsByChildId } from "@/lib/services";
import { EventTimelineItem } from "@/components/features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    const childId = user.childrenIds?.[0];
    if (!childId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Solo obtenemos los datos del niño la primera vez.
        // Los eventos se recargan cada vez que cambia la fecha.
        const [childData, eventsData] = await Promise.all([
          child ? Promise.resolve(child) : getChildById(childId),
          getEventsByChildId(childId, selectedDate),
        ]);

        if (!child) setChild(childData);
        setEvents(eventsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la información. Intenta de nuevo más tarde."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedDate]); // Se ejecuta cuando cambia el usuario o la fecha

  const handlePreviousDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, 1));
  };

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) return "Hoy";
    if (isYesterday(date)) return "Ayer";
    return format(date, "EEEE", { locale: es });
  };

  const isNextDayDisabled = isToday(startOfDate(selectedDate));

  if (!user && !isLoading) {
    // Manejar el caso donde el usuario no está logueado
    return <div>Inicia sesión para ver el dashboard.</div>;
  }

  if (!child && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-xl font-semibold">No hay alumnos asignados</h2>
        <p className="max-w-md text-shark-gray-500">
          Parece que tu cuenta no está vinculada a ningún alumno. Por favor,
          contacta con la administración del centro para que te asignen a tu
          hijo/a.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl p-4 md:p-8">
      {child && (
        <header className="mb-8 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src={child.avatarUrl} alt={child.firstName} />
            <AvatarFallback className="text-2xl">
              {child.firstName.charAt(0)}
              {child.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-shark-gray-900">
              {child.firstName} {child.lastName}
            </h1>
            <p className="text-base capitalize text-shark-gray-500">
              Historial de eventos
            </p>
          </div>
        </header>
      )}

      {/* Date Navigator */}
      <div className="mb-8 rounded-lg border bg-white p-4">
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

      {isLoading ? (
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
          {events.map((event, index) => (
            <EventTimelineItem
              key={event.id}
              event={event}
              isLast={index === events.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-shark-gray-300" />
          <h3 className="text-lg font-semibold text-shark-gray-700">
            No hay eventos este día
          </h3>
          <p className="text-sm text-shark-gray-500">
            No se ha registrado ninguna actividad para {child?.firstName} en la
            fecha seleccionada.
          </p>
        </div>
      )}
    </main>
  );
}
