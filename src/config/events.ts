import { AlertCircle, Apple, Baby, Moon, Palette, Pill } from "lucide-react";
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
  food: {
    id: "food",
    label: "Alimentación",
    icon: Apple,
    color: "#2e8b57",
    formType: "simple",
    details: [
      { id: "breakfast", label: "Desayuno" },
      { id: "lunch", label: "Almuerzo" },
      { id: "snack", label: "Snack" },
    ],
  },
  sleep: {
    id: "sleep",
    label: "Sueño/Siesta",
    icon: Moon,
    color: "#8a2be2",
    formType: "custom",
  },
  diaper: {
    id: "diaper",
    label: "Pañal/Higiene",
    icon: Baby,
    color: "#0066ff",
    formType: "simple",
    details: [
      { id: "pee", label: "Pipi" },
      { id: "poo", label: "Popo" },
      { id: "both", label: "Ambos" },
    ],
  },
  activity: {
    id: "activity",
    label: "Actividad",
    icon: Palette,
    color: "#ffc300",
    formType: "note",
  },
  incident: {
    id: "incident",
    label: "Incidente",
    icon: AlertCircle,
    color: "#ff4444",
    formType: "note",
  },
  medicine: {
    id: "medicine",
    label: "Medicamento",
    icon: Pill,
    color: "#ff9966",
    formType: "custom",
  },
};
