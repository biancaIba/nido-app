"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  IdCard,
  Users,
  UserCircle,
  Loader2,
  LogOut,
} from "lucide-react";

import { Classroom } from "@/lib/types";
import { useAuth } from "@/lib/hooks";
import { getClassroomById } from "@/lib/services";
import { Badge, Button } from "@/components/ui";
import { UserAvatar } from "@/components/features";

export default function MaestroPerfil() {
  const { user, loading, logOut } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);

  useEffect(() => {
    // Store the classroomIds in a local constant.
    const classroomIds = user?.teacherProfile?.classroomIds;

    // Check if the array exists and has items.
    if (classroomIds && classroomIds.length > 0) {
      const fetchClassrooms = async () => {
        setIsLoadingClassrooms(true);
        // Now use the safe local constant 'classroomIds'.
        const promises = classroomIds.map((id) => getClassroomById(id));
        const fetchedClassrooms = await Promise.all(promises);
        setClassrooms(fetchedClassrooms.filter(Boolean) as Classroom[]);
        setIsLoadingClassrooms(false);
      };
      fetchClassrooms();
    } else {
      // If there are no classroomIds, we are done loading.
      setIsLoadingClassrooms(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudo cargar el perfil del usuario.
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const memberSince = user.createdAt
    ? format(user.createdAt.toDate(), "yyyy")
    : "";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <main className="flex-1 md:ml-0">
        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          {/* Profile Hero Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Header Background */}
            <div className="h-24 bg-gradient-to-r from-lightning-yellow-500/20 to-lightning-yellow-500/10"></div>

            {/* Profile Header Content */}
            <div className="px-6 md:px-8 pb-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-16">
                {/* Avatar */}
                <div className="relative">
                  <UserAvatar user={user} size="lg" />
                </div>

                {/* Name and Role */}
                <div className="flex-1 text-center md:text-left md:ml-4 md:mb-2">
                  <h1 className="text-gray-900 mb-2">{fullName}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Badge variant="purple">Maestro/a</Badge>
                    <Badge variant="green">Activo</Badge>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="md:mb-2">
                  <Button
                    onClick={() => logOut()}
                    variant="destructive"
                    size="xs"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-lightning-yellow-500/10 flex items-center justify-center">
                  <UserCircle className="h-4 w-4 text-lightning-yellow-600" />
                </div>
                Información Personal
              </h2>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      Correo Electrónico
                    </p>
                    <p className="text-gray-900 break-all">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                    <p className="text-gray-900">{user?.phone}</p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      Fecha de Nacimiento
                    </p>
                    <p className="text-gray-900">{user?.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-lightning-yellow-500/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-lightning-yellow-600" />
                </div>
                Detalles Profesionales
              </h2>

              <div className="space-y-5">
                {/* Assigned Classroom */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      Salas Asignadas
                    </p>
                    <p className="text-gray-900">
                      {isLoadingClassrooms
                        ? "Cargando..."
                        : classrooms.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Shift */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Turnos</p>
                    <p className="text-gray-900">
                      {user.teacherProfile?.shift}
                    </p>
                  </div>
                </div>

                {/* Employee ID */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <IdCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">ID de Empleado</p>
                    <p className="text-gray-600 text-sm">
                      {user.teacherProfile?.employeeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section (Optional) */}
          <div className="mt-6 bg-lightning-yellow-500/5 rounded-2xl p-6 border border-lightning-yellow-500/10">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-lightning-yellow-500/10 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-lightning-yellow-500" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">
                  Miembro desde {memberSince}
                </h3>
                <p className="text-sm text-gray-600">
                  Has estado brindando cuidado excepcional a nuestros pequeños
                  durante este tiempo. ¡Gracias por tu dedicación!
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="md:mb-2">
            <button
              onClick={() => logOut()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
