"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { createChild } from "@/lib/services";
import { Classroom, ChildFormData, Child } from "@/lib/types";

// Helper to generate a DiceBear avatar URL
const generateAvatarUrl = (seed: string) => {
  return createAvatar(adventurer, {
    seed,
    size: 128,
    radius: 50, // Makes it circular
  }).toDataUri();
};

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
    dateOfBirth: "",
    classroomId: "",
    avatarUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [parentEmails, setParentEmails] = useState<string[]>([""]);

  const avatarOptions = useMemo(() => {
    return Array.from({ length: 6 }, () =>
      generateAvatarUrl(Math.random().toString(36).substring(7))
    );
  }, []);

  if (!formData.avatarUrl && avatarOptions.length > 0) {
    setFormData((prev) => ({ ...prev, avatarUrl: avatarOptions[0] }));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassroomChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classroomId: value }));
  };

  const handleAddParentEmail = () => {
    setParentEmails([...parentEmails, ""]);
  };

  const handleRemoveParentEmail = (index: number) => {
    const newEmails = parentEmails.filter((_, i) => i !== index);
    setParentEmails(newEmails);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...parentEmails];
    newEmails[index] = value;
    setParentEmails(newEmails);
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.classroomId ||
      !formData.avatarUrl ||
      !user?.uid
    ) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newChild = await createChild(formData, user.uid);
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
      {/* Form */}
      <div className="space-y-6 p-4 pb-24">
        {/* Avatar Selection */}
        <div>
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-lightning-yellow-600">
              <AvatarImage src={formData.avatarUrl} alt="Avatar seleccionado" />
              <AvatarFallback className="text-3xl">
                {formData.firstName?.charAt(0).toUpperCase() ||
                  formData.lastName?.charAt(0).toUpperCase() ||
                  "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-2">
            {avatarOptions.map((avatarSrc) => (
              <Button
                key={avatarSrc}
                variant="ghost"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, avatarUrl: avatarSrc }))
                }
                className={`rounded-full transition-all ${
                  formData.avatarUrl === avatarSrc
                    ? "ring-2 ring-lightning-yellow-600 ring-offset-2"
                    : "hover:scale-105"
                }`}
              >
                <Avatar>
                  <AvatarImage src={avatarSrc} alt="Opción de avatar" />
                </Avatar>
              </Button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div>
          <h3 className="text-shark-gray-900 mb-2">Nombre</h3>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="e.g., Juan"
          />
        </div>

        <div>
          <h3 className="text-shark-gray-900 mb-2">Apellido</h3>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="e.g., Pérez"
          />
        </div>

        <div>
          <h3 className="text-shark-gray-900 mb-2">Fecha de Nacimiento</h3>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <h3 className="text-shark-gray-900 mb-2">Sala</h3>
          <Select
            value={formData.classroomId}
            onValueChange={handleClassroomChange}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Selecciona una sala"
                className="text-sm"
              />
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

        {/* Section 2: Assign Parents */}
        <div>
          <h3 className="text-shark-gray-900 mb-2">Tutores</h3>
          <p className="text-sm text-shark-gray-900/60 mb-4">
            Ingrese los correos electrónicos de los tutores. Recibirán una
            invitación por correo para descargar la aplicación.
          </p>

          <div className="space-y-3">
            {parentEmails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder={`Correo Electrónico`}
                  />
                </div>
                {parentEmails.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveParentEmail(index)}
                  >
                    <Trash2 className="h-8 w-8 text-carnation-500" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              onClick={handleAddParentEmail}
              className="w-full h-12 gap-2"
            >
              <Plus className="h-5 w-5" />
              Agregar
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-21 left-0 right-0 bg-white p-4 flex items-center">
        <Button variant="outline" onClick={onBack} className="mr-2">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-lightning-yellow-600 hover:bg-lightning-yellow-600/90"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
