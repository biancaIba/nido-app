"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

import { useAuth } from "@/lib/hooks";
import { createTeacher, updateTeacher } from "@/lib/services";
import { Classroom, TeacherFormData, User } from "@/lib/types";
import { Button, Input, MultiSelect } from "@/components/ui";

interface AddEditTeacherProps {
  onBack: () => void;
  onSaveSuccess: (newTeacher: User) => void;
  classrooms: Classroom[];
  initialData?: User;
}

export function AddEditTeacher({
  onBack,
  onSaveSuccess,
  classrooms,
  initialData,
}: AddEditTeacherProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    classroomIds: [],
    phone: "",
    dateOfBirth: "",
    shift: "",
    employeeId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      let dob = "";
      if (initialData.dateOfBirth) {
        if (initialData.dateOfBirth instanceof Timestamp) {
          dob = initialData.dateOfBirth.toDate().toISOString().split("T")[0];
        } else if (typeof initialData.dateOfBirth === "string") {
          dob = initialData.dateOfBirth;
        }
      }

      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        classroomIds: initialData.teacherProfile?.classroomIds || [],
        phone: initialData.phone || "",
        dateOfBirth: dob,
        shift: initialData.teacherProfile?.shift || "",
        employeeId: initialData.teacherProfile?.employeeId || "",
      });
    }
  }, [initialData]);

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
      if (initialData) {
        await updateTeacher(initialData.uid, formData, user.uid);
        toast.success(
          `Maestro "${formData.firstName}" actualizado exitosamente.`
        );
        onSaveSuccess({ ...initialData, ...formData });
      } else {
        const newTeacher = await createTeacher(formData, user.uid);
        toast.success(`Maestro "${newTeacher.firstName}" creado exitosamente.`);
        onSaveSuccess(newTeacher);
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast.error("No se pudo guardar el maestro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-4 pb-24">
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
          <h3 className="text-shark-gray-900 mb-2">Nro Empleado</h3>
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
