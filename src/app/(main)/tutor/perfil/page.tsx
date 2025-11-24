"use client";

import {
  Mail,
  Phone,
  Calendar,
  UserCircle,
  Loader2,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/lib/hooks";
import { Badge, Button } from "@/components/ui";
import { UserAvatar } from "@/components/features";

export default function TutorPerfil() {
  const { user, loading, logOut } = useAuth();

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
                    <Badge variant="purple">Tutor/a</Badge>
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
          </div>
        </div>
      </main>
    </div>
  );
}
