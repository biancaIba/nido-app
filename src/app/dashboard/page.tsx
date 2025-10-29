"use client";

import { useState } from "react";
import { Users, X } from "lucide-react";

import { EventModal, StudentCard } from "@/components/nido";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastEvent?: {
    type: string;
    time: string;
    color: string;
  };
}

// Mock data for students
const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Sofía García",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    lastEvent: { type: "Comida", time: "12:30", color: "#2e8b57" },
  },
  {
    id: "2",
    name: "Lucas Martínez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    lastEvent: { type: "Siesta", time: "14:00", color: "#8a2be2" },
  },
  {
    id: "3",
    name: "Valentina López",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina",
    lastEvent: { type: "Baño", time: "11:45", color: "#0066ff" },
  },
  {
    id: "4",
    name: "Mateo Rodríguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo",
    lastEvent: { type: "Actividad", time: "10:30", color: "#ffc300" },
  },
  {
    id: "5",
    name: "Emma Fernández",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastEvent: { type: "Comida", time: "12:15", color: "#2e8b57" },
  },
  {
    id: "6",
    name: "Benjamín Torres",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin",
    lastEvent: { type: "Siesta", time: "13:45", color: "#8a2be2" },
  },
  {
    id: "7",
    name: "Mía Sánchez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
  },
  {
    id: "8",
    name: "Santiago Díaz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago",
    lastEvent: { type: "Baño", time: "15:20", color: "#0066ff" },
  },
  {
    id: "9",
    name: "Isabella Ruiz",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    lastEvent: { type: "Actividad", time: "09:45", color: "#ffc300" },
  },
  {
    id: "10",
    name: "Thiago Moreno",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thiago",
    lastEvent: { type: "Comida", time: "12:00", color: "#2e8b57" },
  },
];

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState("sala-2024-manana");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  const handleStudentClick = (student: Student) => {
    if (selectionMode) {
      // Toggle selection in group mode
      const newSelected = new Set(selectedStudents);
      if (newSelected.has(student.id)) {
        newSelected.delete(student.id);
      } else {
        newSelected.add(student.id);
      }
      setSelectedStudents(newSelected);
    } else {
      // Open modal for individual event
      setSelectedStudent(student);
      setIsModalOpen(true);
    }
  };

  const handleGroupEventClick = () => {
    if (selectionMode) {
      // Cancel selection mode
      setSelectionMode(false);
      setSelectedStudents(new Set());
    } else {
      // Start selection mode
      setSelectionMode(true);
    }
  };

  const handleGroupEventSubmit = () => {
    if (selectedStudents.size === 0) {
      return;
    }
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEventSubmit = () => {
    if (selectionMode && selectedStudents.size > 0) {
      setSelectionMode(false);
      setSelectedStudents(new Set());
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-shark-gray-50">
      {/* Room Selector */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 shadow-sm">
        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Seleccionar sala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sala-2024-manana">
              Sala 2024 - Turno Mañana
            </SelectItem>
            <SelectItem value="sala-2024-tarde">
              Sala 2024 - Turno Tarde
            </SelectItem>
            <SelectItem value="sala-2023-manana">
              Sala 2023 - Turno Mañana
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Group Event Button */}
      <div className="sticky top-14 z-30 px-4 pt-4 pb-2 bg-shark-gray-50">
        <Button
          onClick={handleGroupEventClick}
          className={`w-full h-10 ${
            selectionMode
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-violet-500 hover:bg-blue-violet-500/90"
          } text-white gap-2`}
        >
          {selectionMode ? (
            <>
              <X className="h-5 w-5" />
              Cancelar Selección
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              Evento Grupal
            </>
          )}
        </Button>
      </div>

      {/* Student Grid */}
      <div className="mt-70 px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {MOCK_STUDENTS.map((student) => (
            <StudentCard
              key={student.id}
              {...student}
              isSelected={selectedStudents.has(student.id)}
              selectionMode={selectionMode}
              onClick={() => handleStudentClick(student)}
            />
          ))}
        </div>
      </div>

      {/* Group Event Action Bar */}
      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-shark-gray-900">
              {selectedStudents.size} de {MOCK_STUDENTS.length} seleccionados
            </span>
          </div>
          <Button
            onClick={handleGroupEventSubmit}
            disabled={selectedStudents.size === 0}
            className="w-full h-12 bg-blue-violet-500 hover:bg-blue-violet-500/90 text-white"
          >
            Cargar Evento para {selectedStudents.size} Alumnos
          </Button>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        studentName={selectedStudent?.name}
        studentCount={selectionMode ? selectedStudents.size : undefined}
        onSubmit={handleEventSubmit}
      />
    </div>
  );
}
