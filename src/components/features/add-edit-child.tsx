"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/hooks";
import { createChild } from "@/lib/services";
import { generateAvatarUrl, generateRandomSeed } from "@/lib/utils";
import { Classroom, ChildFormData, Child } from "@/lib/types";
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
    avatarSeed: "",
    authorizedEmails: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarSeedOptions = useMemo(() => {
    return Array.from({ length: 6 }, () => generateRandomSeed());
  }, []);

  if (!formData.avatarSeed && avatarSeedOptions.length > 0) {
    setFormData((prev) => ({ ...prev, avatarSeed: avatarSeedOptions[0] }));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassroomChange = (value: string) => {
    setFormData((prev) => ({ ...prev, classroomId: value }));
  };

  const handleAddParentEmail = () => {
    setFormData((prev) => ({
      ...prev,
      authorizedEmails: [...prev.authorizedEmails, ""],
    }));
  };

  const handleRemoveParentEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      authorizedEmails: prev.authorizedEmails.filter((_, i) => i !== index),
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.authorizedEmails];
    newEmails[index] = value;
    setFormData((prev) => ({ ...prev, authorizedEmails: newEmails }));
  };

  const handleSubmit = async () => {
    // 1. Asegurarse de que el usuario (el admin) esté cargado antes de continuar.
    if (!user) {
      toast.error(
        "No se pudo verificar al administrador. Por favor, recarga la página."
      );
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.classroomId ||
      !formData.avatarSeed ||
      formData.authorizedEmails.some((email) => email.trim() === "")
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
              <AvatarImage
                src={generateAvatarUrl(formData.avatarSeed)}
                alt="Avatar seleccionado"
              />
              <AvatarFallback className="text-3xl">
                {formData.firstName?.charAt(0).toUpperCase() ||
                  formData.lastName?.charAt(0).toUpperCase() ||
                  "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-2">
            {avatarSeedOptions.map((seed) => (
              <Button
                key={seed}
                variant="ghost"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, avatarSeed: seed }))
                }
                className={`rounded-full transition-all ${
                  formData.avatarSeed === seed
                    ? "ring-2 ring-lightning-yellow-600 ring-offset-2"
                    : "hover:scale-105"
                }`}
              >
                <Avatar>
                  <AvatarImage
                    src={generateAvatarUrl(seed)}
                    alt="Opción de avatar"
                  />
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
            {formData.authorizedEmails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder={`Correo Electrónico`}
                  />
                </div>
                {formData.authorizedEmails.length > 1 && (
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
