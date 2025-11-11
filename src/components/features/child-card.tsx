import { Check } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
} from "@/components/ui";
import { Child } from "@/lib/types";

interface ChildCardProps {
  child: Child;
  lastEvent?: {
    type: string;
    time: string;
    color: string;
  };
  isSelected?: boolean;
  selectionMode?: boolean;
  onClick?: () => void;
}

const EVENT_ICONS: { [key: string]: string } = {
  Comida: "🍎",
  Siesta: "🌙",
  Baño: "🚽",
  Actividad: "🎨",
  Incidente: "🚨",
  Medicamento: "💊",
};

export function ChildCard({
  child,
  lastEvent,
  isSelected,
  selectionMode,
  onClick,
}: ChildCardProps) {
  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-blue-violet-500 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      {selectionMode && isSelected && (
        <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-violet-500">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="flex flex-col items-center p-4 space-y-3">
        <Avatar className="h-20 w-20 border-4 border-white shadow-md">
          <AvatarImage src={child.avatarUrl} alt={child.firstName} />
          <AvatarFallback className="bg-blue-violet-500 text-white">
            {child.firstName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center w-full">
          <p className="text-shark-gray-900 truncate px-1">{child.firstName}</p>
        </div>

        {lastEvent && (
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 w-full justify-center"
            style={{
              backgroundColor: `${lastEvent.color}20`,
              color: lastEvent.color,
            }}
          >
            <span className="mr-1">{EVENT_ICONS[lastEvent.type]}</span>
            <span className="truncate">
              {lastEvent.type} - {lastEvent.time}
            </span>
          </Badge>
        )}
      </div>
    </Card>
  );
}
