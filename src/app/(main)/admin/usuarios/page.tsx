"use client";

import { useEffect, useMemo, useState } from "react";
// import { format } from "date-fns";

import { User } from "@/lib/types";
import { Badge, DataGrid } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { getUsers } from "@/lib/services";
import { UserAvatar } from "@/components/features";

// TODO: Mapear roles para mostrar nombres más amigables
const roleMap: Record<string, string> = {
  admin: "Administrador",
  parent: "Tutor",
  teacher: "Maestro",
};

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError("No se pudieron cargar los usuarios.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columnDefs = useMemo(() => {
    const columns: Record<string, unknown>[] = [
      {
        field: "firstName",
        headerName: "Nombre",
        filter: "agTextColumnFilter",
        autoHeight: true,
        wrapText: true,
        flex: 2,
        minWidth: 250,
        cellRenderer: (params: { data: User }) => (
          <div className="flex items-center gap-3 py-3">
            <UserAvatar user={params.data} size="sm" />
            <div className="flex flex-col">
              <span className="font-medium text-shark-gray-900">
                {params.data.firstName} {params.data.lastName}
              </span>
              <span className="text-sm text-shark-gray-500">
                {params.data.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Estado",
        width: 180,
        filter: "agTextColumnFilter",
        cellClass: "py-3",
        cellRenderer: () => (
          <Badge variant="green" size="lg">
            Active
          </Badge>
        ),
      },
      {
        field: "role",
        headerName: "Rol",
        width: 180,
        filter: "agTextColumnFilter",
        autoHeight: true,
        cellClass: "flex items-center",
        valueGetter: (params: { data: User }) =>
          params.data.role.map((role) => roleMap[role] || role).join(", "),
        cellRenderer: (params: { data: User }) => (
          <div className="flex flex-col items-start gap-1 py-2">
            {params.data.role.map((role) => (
              <span key={role} className="capitalize">
                {roleMap[role] || role}
              </span>
            ))}
          </div>
        ),
      },
    ];
    return columns;
  }, []);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    autoWidth: true,
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-shark-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shark-gray-50 pb-20">
      <div className="space-y-6 px-4 py-4">
        {/* Page Title */}
        <div className="mb-4">
          <h3 className="text-gray-900 text-xl font-semibold">Usuarios</h3>
        </div>

        <div className="w-full">
          <DataGrid
            columnDefs={columnDefs}
            rowData={users as unknown as Record<string, unknown>[]}
            defaultColDef={defaultColDef}
            pagination={false}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
