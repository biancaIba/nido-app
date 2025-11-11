"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/hooks";
import { Child, Event } from "@/lib/types";
import { getChildById, getEventsByChildId } from "@/lib/services";
import { EventTimelineItem } from "@/components/features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.childrenIds || user.childrenIds.length === 0) {
      // Si no hay usuario o no tiene hijos asignados, no hacemos nada.
      // Podríamos mostrar un mensaje aquí.
      setIsLoading(false);
      return;
    }

    const childId = user.childrenIds[0]; // Usamos el primer hijo por ahora

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtenemos los datos en paralelo
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-shark-gray-500">Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center">
        <p className="text-shark-gray-500">
          No tienes alumnos asignados. Contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 justify-center">
        <Avatar key={child.id} className="bg-blue-violet-500 text-white">
          <AvatarImage src={child.avatarUrl} />
          <AvatarFallback>
            {child.firstName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-lg text-gray-600 font-medium">
          {child.firstName} {child.lastName}
        </span>
      </div>
      <p className="mb-4 text-shark-gray-500">Actividad del día de hoy</p>

      <div className="divide-y divide-gray-200">
        {events.length > 0 ? (
          events.map((event) => (
            <EventTimelineItem key={event.id} event={event} />
          ))
        ) : (
          <div className="pt-8 text-center">
            <p className="text-shark-gray-500">
              Aún no hay eventos registrados hoy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
