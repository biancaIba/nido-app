import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Moon, Apple, Toilet, AlertCircle, Palette, Pill } from "lucide-react";

import {
  Child,
  FoodDetails,
  SleepDetails,
  DiaperDetails,
  NoteDetails,
} from "@/lib/types";
import {
  Button,
  Label,
  Input,
  Textarea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenData: Child[];
  onSubmit: (eventData: EventFormData) => Promise<void>;
}

export interface EventFormData {
  category:
    | "food"
    | "sleep"
    | "diaper"
    | "activity"
    | "incident"
    | "general_note";
  details: FoodDetails | SleepDetails | DiaperDetails | NoteDetails;
  eventTime: Timestamp;
  comment?: string;
}

const EVENT_CATEGORIES = [
  {
    id: "siesta",
    label: "Sueño/Siesta",
    icon: Moon,
    color: "#8a2be2",
    details: ["Inicio", "Fin", "No durmió", "Despertó llorando"],
  },
  {
    id: "alimentacion",
    label: "Alimentación",
    icon: Apple,
    color: "#2e8b57",
    details: ["Leche", "Sólido", "Agua", "Rechazó"],
  },
  {
    id: "higiene",
    label: "Higiene/Baño",
    icon: Toilet,
    color: "#0066ff",
    details: ["Pañal limpio", "Pañal sucio", "Baño completo", "Cambio de ropa"],
  },
  {
    id: "incidente",
    label: "Incidente",
    icon: AlertCircle,
    color: "#ff4444",
    details: ["Golpe leve", "Caída", "Llanto", "Malestar"],
  },
  {
    id: "actividad",
    label: "Actividad",
    icon: Palette,
    color: "#ffc300",
    details: ["Arte", "Música", "Juego libre", "Lectura"],
  },
  {
    id: "medicamento",
    label: "Medicamento",
    icon: Pill,
    color: "#ff9966",
    details: ["Dosis única", "Tratamiento", "Vitaminas"],
  },
];

export function EventModal({
  isOpen,
  onClose,
  childrenData,
  onSubmit,
}: EventModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);

    try {
      // Convert time string to Timestamp
      const [hours, minutes] = time.split(":").map(Number);
      const eventDate = new Date();
      eventDate.setHours(hours, minutes, 0, 0);
      const eventTimestamp = Timestamp.fromDate(eventDate);

      // Build details based on category
      let details: FoodDetails | SleepDetails | DiaperDetails | NoteDetails;

      switch (selectedCategory) {
        case "alimentacion":
          details = {
            mealType: (selectedDetail?.toLowerCase() === "leche"
              ? "breakfast"
              : selectedDetail?.toLowerCase() === "sólido"
              ? "lunch"
              : "snack") as FoodDetails["mealType"],
            description: comment || undefined,
          } as FoodDetails;
          break;
        case "siesta":
          details = {
            startTime: eventTimestamp,
            endTime: selectedDetail === "Fin" ? eventTimestamp : undefined,
          } as SleepDetails;
          break;
        case "higiene":
          details = {
            type: (selectedDetail?.includes("limpio")
              ? "pee"
              : selectedDetail?.includes("sucio")
              ? "poo"
              : "both") as DiaperDetails["type"],
            observation: comment || undefined,
          } as DiaperDetails;
          break;
        case "actividad":
        case "incidente":
        case "medicamento":
          details = {
            description: selectedDetail
              ? `${selectedDetail}${comment ? `: ${comment}` : ""}`
              : comment,
          } as NoteDetails;
          break;
        default:
          details = { description: comment } as NoteDetails;
      }

      // Map UI categories to Event type categories
      const categoryMap: Record<string, EventFormData["category"]> = {
        siesta: "sleep",
        alimentacion: "food",
        higiene: "diaper",
        incidente: "incident",
        actividad: "activity",
        medicamento: "general_note",
      };

      const eventData: EventFormData = {
        category: categoryMap[selectedCategory] || "general_note",
        details,
        eventTime: eventTimestamp,
        comment: comment || undefined,
      };

      await onSubmit(eventData);

      // Reset form
      setSelectedCategory(null);
      setSelectedDetail(null);
      setComment("");
      setTime(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = EVENT_CATEGORIES.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {childrenData.length > 1
              ? `Registrar Evento para ${childrenData.length} Alumnos`
              : `Registrar Evento para: ${childrenData[0]?.firstName}`}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Event Categories Grid */}
          <div>
            <Label className="mb-3 block">Seleccionar Categoría</Label>
            <div className="grid grid-cols-2 gap-3">
              {EVENT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedDetail(null);
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      selectedCategory === category.id
                        ? "border-current shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      color:
                        selectedCategory === category.id
                          ? category.color
                          : "#6b7280",
                      backgroundColor:
                        selectedCategory === category.id
                          ? `${category.color}10`
                          : "white",
                    }}
                  >
                    <Icon className="h-8 w-8 mb-2" />
                    <span className="text-center text-sm">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Options */}
          {selectedCategoryData && (
            <div>
              <Label className="mb-3 block">Detalles</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCategoryData.details.map((detail) => (
                  <button
                    key={detail}
                    onClick={() => setSelectedDetail(detail)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedDetail === detail
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={
                      selectedDetail === detail
                        ? { backgroundColor: selectedCategoryData.color }
                        : undefined
                    }
                  >
                    {detail}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Input */}
          <div>
            <Label htmlFor="time" className="mb-2 block">
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Comment Textarea */}
          <div>
            <Label htmlFor="comment" className="mb-2 block">
              Comentarios (Opcional)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agregar notas adicionales..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedCategory || isSubmitting}
            className="w-full h-12 bg-blue-violet-500 hover:bg-blue-violet-500/90 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrar Evento"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
