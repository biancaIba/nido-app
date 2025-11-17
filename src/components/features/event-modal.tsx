"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { EVENTS_CONFIG } from "@/config";
import {
  EventCategory,
  FoodDetails,
  DiaperDetails,
  NewDocument,
  Event,
  SleepDetails,
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
import { cn } from "@/lib/utils";

// --- Utility Functions and Constants ---

const eventCategories = Object.values(EVENTS_CONFIG);

export type EventFormPayload = Omit<
  NewDocument<Event>,
  | "id"
  | "childId"
  | "teacherId"
  | "createdBy"
  | "updatedBy"
  | "deletedBy"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
>;

interface FormData {
  eventTime: string;
  detailId: string; // For 'simple' forms (food, diaper)
  foodDescription: string;
  diaperObservation: string;
  endTime: string; // For 'sleep'
  medicineName: string;
  medicineDose: string;
  noteDescription: string; // For 'note' forms
}

function getLocalTime(): string {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeStringToTimestamp(timeStr: string): Timestamp {
  if (!timeStr || !timeStr.includes(":")) {
    console.warn("Invalid time string provided:", timeStr);
    return Timestamp.now();
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  const eventDate = new Date();
  eventDate.setHours(hours, minutes, 0, 0);
  return Timestamp.fromDate(eventDate);
}

// --- Component Props ---

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: EventFormPayload) => Promise<void>;
}

// --- Main Component ---

export function EventModal({ isOpen, onClose, onSubmit }: EventModalProps) {
  // This state now controls which step we are on.
  // null = Step 1 (Category Selection)
  // EventCategory = Step 2 (Details Form)
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(null);

  const [formData, setFormData] = useState<Partial<FormData>>({
    eventTime: getLocalTime(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedCategory(null); // Go back to step 1
    setFormData({ eventTime: getLocalTime() });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCategorySelect = (category: EventCategory) => {
    // Clear form details but keep the time, then move to step 2
    const { eventTime } = formData;
    setFormData({ eventTime });
    setSelectedCategory(category);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !formData.eventTime) return;

    setIsSubmitting(true);
    let payload: EventFormPayload;
    const eventTimestamp = timeStringToTimestamp(formData.eventTime);

    try {
      switch (selectedCategory) {
        case "food":
          if (!formData.detailId) throw new Error("Meal type is required");
          payload = {
            category: "food",
            eventTime: eventTimestamp,
            details: {
              mealType: formData.detailId as FoodDetails["mealType"],
              description: formData.foodDescription || "",
            },
          };
          break;
        case "sleep":
          const sleepDetails: SleepDetails = { startTime: eventTimestamp };
          if (formData.endTime) {
            sleepDetails.endTime = timeStringToTimestamp(formData.endTime);
          }
          payload = {
            category: "sleep",
            eventTime: Timestamp.now(), // Log time is always 'now'
            details: sleepDetails,
          };
          break;
        case "diaper":
          if (!formData.detailId) throw new Error("Diaper type is required");
          payload = {
            category: "diaper",
            eventTime: eventTimestamp,
            details: {
              type: formData.detailId as DiaperDetails["type"],
              observation: formData.diaperObservation || "",
            },
          };
          break;
        case "medicine":
          if (!formData.medicineName || !formData.medicineDose)
            throw new Error("Medicine name and dose are required");
          payload = {
            category: "medicine",
            eventTime: eventTimestamp,
            details: {
              name: formData.medicineName,
              dose: formData.medicineDose,
            },
          };
          break;
        case "activity":
          payload = {
            category: "activity",
            eventTime: eventTimestamp,
            details: {},
          };
          break;
        case "incident":
          payload = {
            category: selectedCategory,
            eventTime: eventTimestamp,
            details: { description: formData.noteDescription || "" },
          };
          break;
        default:
          throw new Error("Invalid category selected");
      }

      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("Error registrando el evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Sub-render functions for each step ---

  const renderCategoryForm = () => {
    // This function remains largely the same
    if (!selectedCategory) return null;
    const config = EVENTS_CONFIG[selectedCategory];

    switch (config.formType) {
      case "simple":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {config.details?.map((detail) => (
                <button
                  key={detail.id}
                  onClick={() => handleInputChange("detailId", detail.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm transition-all",
                    formData.detailId === detail.id
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                  style={
                    formData.detailId === detail.id
                      ? { backgroundColor: config.color }
                      : undefined
                  }
                >
                  {detail.label}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <Label className="block mb-2">
                Comentarios{" "}
                <span className="text-shark-gray-500 text-sm">-Opcional-</span>
              </Label>
              <Textarea
                value={
                  selectedCategory === "food"
                    ? formData.foodDescription
                    : formData.diaperObservation
                }
                onChange={(e) =>
                  handleInputChange(
                    selectedCategory === "food"
                      ? "foodDescription"
                      : "diaperObservation",
                    e.target.value
                  )
                }
                placeholder="Más información sobre el evento..."
                className="min-h-30"
              />
            </div>
          </div>
        );
      case "custom":
        if (selectedCategory === "sleep") {
          return (
            <div className="space-y-4">
              <Label htmlFor="endTime">Hora de Fin (Opcional)</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime || ""}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
              />
            </div>
          );
        }
        if (selectedCategory === "medicine") {
          return (
            <div className="space-y-4">
              <Label htmlFor="medicineName">Nombre del Medicamento</Label>
              <Input
                id="medicineName"
                value={formData.medicineName || ""}
                onChange={(e) =>
                  handleInputChange("medicineName", e.target.value)
                }
                placeholder="Ej: Paracetamol"
              />
              <Label htmlFor="medicineDose">Dosis</Label>
              <Input
                id="medicineDose"
                value={formData.medicineDose || ""}
                onChange={(e) =>
                  handleInputChange("medicineDose", e.target.value)
                }
                placeholder="Ej: 5ml"
              />
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-4">
        <SheetHeader>
          {/* --- Back Button for Step 2 --- */}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="absolute left-4 top-4 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <SheetTitle className="text-center">
            {selectedCategory ? "Detalles" : "Categoría"}
          </SheetTitle>
        </SheetHeader>

        {/* --- Main Content: Switches between Step 1 and Step 2 --- */}
        <div className="py-6">
          {!selectedCategory ? (
            // --- STEP 1: Category Selection ---
            <div className="grid grid-cols-2 gap-4">
              {eventCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all aspect-square hover:border-gray-300"
                    style={{
                      color: category.color,
                      backgroundColor: `${category.color}1A`,
                    }}
                  >
                    <Icon className="h-10 w-10 mb-2" />
                    <span className="text-center text-base font-medium text-gray-800">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            // --- STEP 2: Details Form ---
            <div className="space-y-6">
              <div>
                <Label htmlFor="time" className="mb-2 block text-base">
                  {selectedCategory === "sleep"
                    ? "Hora de Inicio"
                    : "Hora del Evento"}
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) =>
                    handleInputChange("eventTime", e.target.value)
                  }
                  className="w-full"
                />
              </div>

              <div>
                <Label className="mb-2 block text-base">Detalles</Label>
                {renderCategoryForm()}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 bg-lightning-yellow-600 hover:bg-lightning-yellow-600/90 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Registrar Evento"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
