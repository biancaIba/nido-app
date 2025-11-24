import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { User } from "@/lib/types";
import { cn, generateAvatarUrl } from "@/lib/utils";
import { cva } from "class-variance-authority";

interface UserAvatarProps {
  user: User;
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

  return (
    <Avatar
      className={cn(
        variants({ size }),
        "border-4 bg-lightning-yellow-600/85 border-white shadow-md"
      )}
    >
      <AvatarImage
        src={
          user.photoURL ||
          (user.avatarSeed ? generateAvatarUrl(user.avatarSeed) : undefined)
        }
        alt={user.firstName}
      />
      <AvatarFallback className={cn("text-white text-lg")}>
        {user.firstName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
