"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/hooks";
import { createTeacher } from "@/lib/services";
import { generateAvatarUrl, generateRandomSeed } from "@/lib/utils";
import { Classroom, TeacherFormData, User } from "@/lib/types";
import {
  Button,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  MultiSelect,
} from "@/components/ui";

interface AddEditTeacherProps {
  onBack: () => void;
  onSaveSuccess: (newTeacher: User) => void;
  classrooms: Classroom[];
}

export function AddEditTeacher({
  onBack,
  onSaveSuccess,
  classrooms,
}: AddEditTeacherProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    avatarSeed: "",
    classroomIds: [],
    phone: "",
    dateOfBirth: "",
    shift: "",
    employeeId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarSeedOptions = useMemo(
    () => Array.from({ length: 6 }, () => generateRandomSeed()),
    []
  );

  if (!formData.avatarSeed && avatarSeedOptions.length > 0) {
    setFormData((prev) => ({ ...prev, avatarSeed: avatarSeedOptions[0] }));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassroomsChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, classroomIds: selectedIds }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("No se pudo verificar al administrador.");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      formData.classroomIds.length === 0
    ) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTeacher = await createTeacher(formData, user.uid);
      toast.success(`Maestro "${newTeacher.firstName}" creado exitosamente.`);
      onSaveSuccess(newTeacher);
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error("No se pudo guardar el maestro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-4 pb-24">
        {/* Avatar Selection (igual que en add-edit-child) */}
        <div>
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage
                src={
                  formData.avatarSeed
                    ? generateAvatarUrl(formData.avatarSeed)
                    : undefined
                }
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
                    ? "ring-2 ring-lightning-yellow-600/60 ring-offset-2"
                    : "hover:scale-105"
                }`}
              >
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
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
          <h3 className="mb-2">Correo Electrónico</h3>
          <p className="text-sm text-shark-gray-900/60 mb-4">
            El maestro ecibirá una invitación por correo para descargar la
            aplicación.
          </p>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="e.g., juan.perez@example.com"
          />
        </div>

        {/* Classroom Selection (Multiple) */}
        <div>
          <h3 className="mb-2">Salas Asignadas</h3>

          <MultiSelect
            value={formData.classroomIds}
            placeholder="Selecciona una o más salas"
            options={classrooms.map((room) => ({
              label: room.name,
              value: room.id,
            }))}
            onValueChange={handleClassroomsChange}
            className="w-full"
            hideSelectAll
            searchable={false}
            variant="nido"
            singleLine
            maxCount={2}
          />
        </div>

        <div>
          <h3 className="text-shark-gray-900 mb-2">Teléfono</h3>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g., +542239804536"
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
          <h3 className="text-shark-gray-900 mb-2">Turno</h3>
          <Input
            id="shift"
            name="shift"
            value={formData.shift}
            onChange={handleInputChange}
            placeholder="e.g., Mañana"
          />
        </div>

        <div>
          <h3 className="text-shark-gray-900 mb-2">Turno</h3>
          <Input
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            placeholder="e.g., EMP12345"
          />
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
