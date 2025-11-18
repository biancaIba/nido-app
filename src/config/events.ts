import {
  AlertCircle,
  Apple,
  Baby,
  MessageSquareText,
  Moon,
  Palette,
  Pill,
} from "lucide-react";
import { EventCategory } from "@/lib/types";

// Define the structure for simple detail options
export interface EventDetailOption {
  id: string;
  label: string;
}

// Define the structure of our configuration
export interface EventConfigItem {
  id: EventCategory;
  label: string;
  icon: typeof Moon;
  color: string;
  // Add form configuration
  formType: "simple" | "custom" | "note";
  details?: EventDetailOption[]; // For 'simple' formType
}

export const EVENTS_CONFIG: Record<EventCategory, EventConfigItem> = {
  Comida: {
    id: "Comida",
    label: "Comida",
    icon: Apple,
    color: "#2e8b57",
    formType: "simple",
    details: [
      { id: "Desayuno", label: "Desayuno" },
      { id: "Almuerzo", label: "Almuerzo" },
      { id: "Snack", label: "Snack" },
    ],
  },
  Sueño: {
    id: "Sueño",
    label: "Sueño",
    icon: Moon,
    color: "#8a2be2",
    formType: "custom",
  },
  Baño: {
    id: "Baño",
    label: "Baño",
    icon: Baby,
    color: "#0066ff",
    formType: "simple",
    details: [
      { id: "Pipi", label: "Pipi" },
      { id: "Popo", label: "Popo" },
      { id: "Ambos", label: "Ambos" },
    ],
  },
  Actividad: {
    id: "Actividad",
    label: "Actividad",
    icon: Palette,
    color: "#ffc300",
    formType: "note",
  },
  Incidente: {
    id: "Incidente",
    label: "Incidente",
    icon: AlertCircle,
    color: "#ff4444",
    formType: "note",
  },
  Medicamento: {
    id: "Medicamento",
    label: "Medicamento",
    icon: Pill,
    color: "#ff9966",
    formType: "custom",
  },
  Otro: {
    id: "Otro",
    label: "Otro",
    icon: MessageSquareText,
    color: "#999999",
    formType: "note",
  },
};
