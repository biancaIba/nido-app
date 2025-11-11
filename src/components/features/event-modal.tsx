"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";

import { EVENTS_CONFIG } from "@/config";
import {
  Child,
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
  childrenData: Child[];
  onSubmit: (payload: EventFormPayload) => Promise<void>;
}

// --- Main Component ---

export function EventModal({
  isOpen,
  onClose,
  childrenData,
  onSubmit,
}: EventModalProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({
    eventTime: getLocalTime(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedCategory(null);
    setFormData({ eventTime: getLocalTime() });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
          // The main eventTime is the startTime of the nap.
          const sleepDetails: SleepDetails = {
            startTime: eventTimestamp,
          };

          // Only add endTime to the object if it has a value.
          // This prevents sending 'undefined' to Firestore.
          if (formData.endTime) {
            sleepDetails.endTime = timeStringToTimestamp(formData.endTime);
          }

          payload = {
            category: "sleep",
            // The eventTime is when it's logged, which we can make now.
            eventTime: Timestamp.now(),
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
        case "incident":
        case "general_note":
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
      setIsSubmitting(false);
    }
  };

  const renderCategoryForm = () => {
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
              placeholder="Comentarios (Opcional)..."
              rows={3}
            />
          </div>
        );
      case "custom":
        if (selectedCategory === "sleep") {
          return (
            <div className="space-y-4">
              {/* The main 'Hora del Evento' now serves as the start time */}
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
      case "note":
        return (
          <Textarea
            value={formData.noteDescription || ""}
            onChange={(e) =>
              handleInputChange("noteDescription", e.target.value)
            }
            placeholder="Describe el evento..."
            rows={4}
          />
        );
      default:
        return null;
    }
  };

  // Determine the label for the main time input based on the category
  const timeInputLabel =
    selectedCategory === "sleep" ? "Hora de Inicio" : "Hora del Evento";

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {childrenData.length > 1
              ? `Evento para ${childrenData.length} Alumnos`
              : `Evento para: ${childrenData[0]?.firstName}`}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <div className="grid grid-cols-2 gap-3">
              {eventCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      // Reset specific form fields when changing category
                      const { eventTime } = formData;
                      setFormData({ eventTime });
                      setSelectedCategory(category.id);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-10 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-current shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    style={{
                      color: isSelected ? category.color : "#6b7280",
                      backgroundColor: isSelected
                        ? `${category.color}1A`
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

          {selectedCategory && (
            <>
              <div>
                <Label htmlFor="time" className="mb-2 block text-base">
                  {timeInputLabel}
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
            </>
          )}

          {selectedCategory && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-violet-500 hover:bg-blue-violet-500/90 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Registrando..." : "Registrar Evento"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
