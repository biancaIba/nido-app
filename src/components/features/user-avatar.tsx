import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cva } from "class-variance-authority";

import { Child, User } from "@/lib/types";
import { cn, generateAvatarUrl } from "@/lib/utils";

interface UserAvatarProps {
  user: User | Child;
  size?: "sm" | "lg";
}

export function UserAvatar({ user, size }: UserAvatarProps) {
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

  // Use a type guard to determine the correct properties
  let imageUrl: string | undefined;
  if ("avatarSeed" in user) {
    // This is a Child object
    imageUrl = generateAvatarUrl(user.avatarSeed);
  } else {
    // This is a User object
    imageUrl = user.photoURL;
  }

  return (
    <Avatar
      className={cn(
        variants({ size }),
        "border-4 bg-lightning-yellow-600/85 border-white shadow-md"
      )}
    >
      <AvatarImage src={imageUrl} alt={user.firstName} />
      <AvatarFallback className={cn("text-white text-lg")}>
        {user.firstName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
