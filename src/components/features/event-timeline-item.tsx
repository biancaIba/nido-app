import { Timestamp } from "firebase/firestore";

import { EVENTS_CONFIG } from "@/config";
import { Event } from "@/lib/types";

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
    <div className="flex items-center space-x-4 py-4">
      {/* Icon */}
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <Icon className="h-6 w-6" style={{ color: config.color }} />
      </div>

      {/* Details */}
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="font-bold text-shark-gray-900">{config.label}</p>
          <p className="text-sm text-shark-gray-500">
            {formatTime(event.eventTime)}
          </p>
        </div>
        <p className="mt-1 text-shark-gray-600">{description}</p>
      </div>
    </div>
  );
}
