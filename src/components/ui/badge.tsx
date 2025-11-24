import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 leading-5 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-blue-ribbon-100 text-blue-ribbon-700 border-blue-ribbon-200 font-normal",
        secondary:
          "rounded-md border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 font-normal",
        destructive:
          "rounded-md border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80 font-normal",
        warning:
          "rounded-full bg-lightning-yellow-100 text-lightning-yellow-700 border-lightning-yellow-200 font-normal",
        success:
          "rounded-full bg-sea-green-800 text-white border-sea-green-800 font-normal",
        danger:
          "rounded-full bg-lightning-yellow-700 text-white border-lightning-yellow-700 font-normal",
        outline:
          "rounded-md text-shark-gray-700 border-shark-gray-100 text-foreground font-normal",
        purple:
          "rounded-full bg-blue-violet-100 text-blue-violet-700 border-blue-violet-200 font-normal",
        neutral:
          "rounded-full bg-shark-gray-100 text-shark-gray-700 border-shark-gray-200 font-normal",
        white:
          "rounded-full bg-white text-shark-gray-700 border-shark-gray-200 font-normal",
        green:
          "rounded-full bg-sea-green-100 text-sea-green-700 border-sea-green-200 font-normal",
        pink: "rounded-full bg-pink-100 text-pink-700 border-pink-200 font-normal",
      },
      size: {
        default: "text-xs px-2 py-0.5",
        sm: "text-[10px] px-1.5 py-0",
        lg: "text-sm px-2.5 py-[1px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
