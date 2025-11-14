"use client";

import { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Screen } from "@/lib/types/screen";

interface AddEditChildProps {
  onNavigate: (screen: Screen) => void;
  mode?: "add" | "edit";
}

// Mock classrooms data
const MOCK_CLASSROOMS = [
  { id: "1", name: "Sala Sol" },
  { id: "2", name: "Sala Luna" },
  { id: "3", name: "Sala Estrellas" },
  { id: "4", name: "Sala 2024 - Turno Mañana" },
];

export function AddEditChild({ onNavigate, mode = "add" }: AddEditChildProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [parentEmails, setParentEmails] = useState<string[]>([""]);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // --- Validation ---
    if (!firstName.trim()) {
      toast.error("Please enter the child’s first name.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter the child’s last name.");
      return;
    }
    if (!classroomId) {
      toast.error("Please select a classroom.");
      return;
    }

    const validEmails = parentEmails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0) {
      toast.error("Please enter at least one parent email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(
      (email) => !emailRegex.test(email)
    );
    if (invalidEmails.length > 0) {
      toast.error("Please enter valid email addresses.");
      return;
    }

    // --- Log State & Navigate ---
    const formData = {
      firstName,
      lastName,
      classroomId,
      parentEmails: validEmails,
    };

    console.log("Form Submitted:", formData);

    toast.success(
      `Child has been ${mode === "add" ? "added" : "updated"} successfully.`
    );
    onNavigate("children");
  };

  return (
    <div className="min-h-screen bg-[--shark-gray-50] pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => onNavigate("children")}
            className="text-[--shark-gray-900]"
            aria-label="Go back to children list"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-medium text-[--shark-gray-900]">
            {mode === "add" ? "Add New Child" : "Edit Child"}
          </h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Child's Information Section */}
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-medium text-[--shark-gray-900]">
            Childs Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="first-name" className="mb-2 block text-sm">
                First Name
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g., Mateo"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="last-name" className="mb-2 block text-sm">
                Last Name
              </Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g., González"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="classroom" className="mb-2 block text-sm">
                Assign to Classroom
              </Label>
              <Select value={classroomId} onValueChange={setClassroomId}>
                <SelectTrigger id="classroom" className="w-full">
                  <SelectValue placeholder="Select a classroom" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CLASSROOMS.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Assign Parents Section */}
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="font-medium text-[--shark-gray-900]">
              Assign Parents
            </h2>
            <p className="text-sm text-[--shark-gray-900]/60">
              They will receive an email invite to download the app.
            </p>
          </div>
          <div className="space-y-3">
            {parentEmails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder={`Parent Email ${index + 1}`}
                  className="flex-grow"
                />
                {parentEmails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveParentEmail(index)}
                    className="shrink-0"
                    aria-label={`Remove Parent Email ${index + 1}`}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddParentEmail}
              className="w-full gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Another Parent
            </Button>
          </div>
        </section>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[--sea-green-500] text-white hover:bg-[--sea-green-500]/90"
        >
          Save Child
        </Button>
      </form>
    </div>
  );
}
