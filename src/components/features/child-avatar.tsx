import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Child } from "@/lib/types";
import { cn, generateAvatarUrl } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface ChildAvatarProps {
  child: Child;
  size?: "sm" | "lg";
}

export function ChildAvatar({ child, size }: ChildAvatarProps) {
  const variants = cva("", {
    variants: {
      size: {
        default: "",
        sm: "w-12 h-12",
        lg: "w-20 h-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  });

  return (
    <Avatar
      className={cn(
        variants({ size }),
        "border-4 bg-lightning-yellow-600/60 border-white shadow-md"
      )}
    >
      <AvatarImage
        src={generateAvatarUrl(child.avatarSeed)}
        alt={child.firstName}
      />
      <AvatarFallback
        className={cn("bg-lightning-yellow-600/70 text-white text-lg")}
      >
        {child.firstName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
