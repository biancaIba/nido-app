import { useState } from "react";
import { Moon, Apple, Toilet, AlertCircle, Palette, Pill } from "lucide-react";

import { Child } from "@/lib/types";
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
  children: Child[];
  onSubmit: (event: EventData) => void;
}

export interface EventData {
  category: string;
  detail?: string;
  time: string;
  comment: string;
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
  children,
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

  const handleSubmit = () => {
    if (!selectedCategory) return;

    onSubmit({
      category: selectedCategory,
      detail: selectedDetail || undefined,
      time,
      comment,
    });

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
  };

  const selectedCategoryData = EVENT_CATEGORIES.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {children.length > 1
              ? `Registrar Evento para ${children.length} Alumnos`
              : `Registrar Evento para: ${children[0].firstName}`}
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
            disabled={!selectedCategory}
            className="w-full h-12 bg-blue-violet-500 hover:bg-blue-violet-500/90 text-white"
          >
            Registrar Evento
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
