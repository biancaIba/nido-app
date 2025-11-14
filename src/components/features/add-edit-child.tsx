"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { createChild } from "@/lib/services";
import { Classroom, ChildFormData, Child } from "@/lib/types";

interface AddEditChildProps {
  onBack: () => void;
  onSaveSuccess: (newChild: Child) => void;
  classrooms: Classroom[];
}

export function AddEditChild({
  onBack,
  onSaveSuccess,
  classrooms,
}: AddEditChildProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ChildFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "", // Initialize dateOfBirth
    classroomId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassroomChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classroomId: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth || // Validate dateOfBirth
      !formData.classroomId ||
      !user?.uid
    ) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave: ChildFormData = {
        ...formData,
      };
      const newChild = await createChild(dataToSave, user.uid);
      toast.success(`Alumno "${newChild.firstName}" creado exitosamente.`);
      onSaveSuccess(newChild);
    } catch (error) {
      console.error("Error creating child:", error);
      toast.error("No se pudo guardar el alumno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white p-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Añadir Alumno</h1>
      </div>

      {/* Form */}
      <div className="space-y-6 p-4 pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt="Avatar del niño" />
              <AvatarFallback className="text-3xl">
                {formData.firstName.charAt(0).toUpperCase() ||
                  formData.lastName.charAt(0).toUpperCase() ||
                  "N"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="e.g., Juan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="e.g., Pérez"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="classroomId">Sala</Label>
          <Select
            value={formData.classroomId}
            onValueChange={handleClassroomChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una sala" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-violet-500 hover:bg-blue-violet-500/90"
        >
          {isSubmitting ? "Guardando..." : "Guardar Alumno"}
        </Button>
      </div>
    </div>
  );
}
