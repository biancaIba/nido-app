import { Check } from "lucide-react";

import { Child } from "@/lib/types";
import { Card } from "@/components/ui";
import { ChildAvatar } from "@/components/features";

interface ChildCardProps {
  child: Child;
  isSelected?: boolean;
  selectionMode?: boolean;
  onClick?: () => void;
}

export function ChildCard({
  child,
  isSelected,
  selectionMode,
  onClick,
}: ChildCardProps) {
  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-lightning-yellow-600 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      {selectionMode && isSelected && (
        <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-lightning-yellow-600">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="flex flex-col items-center p-4 space-y-3">
        <ChildAvatar child={child} size="lg" />

        <div className="text-center w-full">
          <p className="text-shark-gray-900 truncate px-1">{child.firstName}</p>
        </div>
      </div>
    </Card>
  );
}
