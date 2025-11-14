import { Timestamp } from "firebase/firestore";

import { EVENTS_CONFIG } from "@/config";
import { Event } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface EventTimelineItemProps {
  event: Event;
}

function formatTime(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventDescription(event: Event): string {
  switch (event.category) {
    case "food":
      return `Comió ${event.details.description || event.details.mealType}.`;
    case "sleep":
      const startTime = formatTime(event.details.startTime);
      if (event.details.endTime) {
        const endTime = formatTime(event.details.endTime);
        return `Durmió de ${startTime} a ${endTime}.`;
      }
      return `Comenzó a dormir a las ${startTime}.`;
    case "diaper":
      return `Cambio de pañal: ${event.details.type}. ${
        event.details.observation || ""
      }`;
    case "medicine":
      return `Tomó ${event.details.name} (${event.details.dose}).`;
    case "activity":
    case "incident":
      return event.details.description || "";
    default:
      return "Evento registrado.";
  }
}

export function EventTimelineItem({ event }: EventTimelineItemProps) {
  const config = EVENTS_CONFIG[event.category];
  const Icon = config.icon;
  const description = getEventDescription(event);

  return (
    <div className="flex gap-x-4 p-4 items-center">
      {/* Columna de la línea de tiempo */}
      <div className="relative flex justify-center items-center">
        {/* Línea vertical */}
        <div
          className="h-11 w-11 rounded-full flex items-center justify-center shadow-md"
          style={{
            backgroundColor: `${config.color}15`,
            borderColor: config.color,
            borderWidth: "2px",
          }}
        >
          <Icon className="h-5 w-5" style={{ color: config.color }} />
        </div>
      </div>

      {/* Tarjeta del evento */}
      <div className="flex-1">
        <div className="flex justify-between">
          <span
            className="flex items-center text-shark-gray-800 font-semibold"
            style={{
              color: `${config.color}`,
            }}
          >
            {config.label}
          </span>
          <p className="text-sm text-shark-gray-500">
            {formatTime(event.eventTime)}
          </p>
        </div>
        {description && description !== "" && (
          <Card className="px-4 py-2 mt-2 bg-white border-0 shadow-sm mb-3">
            <span className="text-shark-gray-600">{description}</span>
          </Card>
        )}
      </div>
    </div>
  );
}
