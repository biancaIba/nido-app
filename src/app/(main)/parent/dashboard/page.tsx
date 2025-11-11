"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, FileText } from "lucide-react";

import { useAuth } from "@/lib/hooks";
import { Child, Event } from "@/lib/types";
import { getChildById, getEventsByChildId } from "@/lib/services";
import { EventTimelineItem } from "@/components/features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (!user.childrenIds || user.childrenIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const childId = user.childrenIds[0];

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [childData, eventsData] = await Promise.all([
          getChildById(childId),
          getEventsByChildId(childId),
        ]);
        setChild(childData);
        setEvents(eventsData);
      } catch (err) {
        setError(
          "No se pudo cargar la información. Intenta de nuevo más tarde."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-shark-gray-400" />
        <p className="text-shark-gray-500">Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!child) {
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
    <main className="container mx-auto max-w-3xl p-6 md:p-8">
      {/* Encabezado */}
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
          <p className="text-base capitalize text-shark-gray-500">{today}</p>
        </div>
      </header>

      {/* Línea de tiempo */}
      <div className="space-y-2">
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventTimelineItem
              key={event.id}
              event={event}
              isLast={index === events.length - 1}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-shark-gray-300" />
            <h3 className="text-lg font-semibold text-shark-gray-700">
              No hay eventos hoy
            </h3>
            <p className="text-sm text-shark-gray-500">
              Aún no se ha registrado ninguna actividad para {child.firstName}{" "}
              en el día de hoy.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
