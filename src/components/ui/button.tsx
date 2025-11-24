import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-hidden focus-visible:border-lightning-yellow-600 focus-visible:shadow-[0_0_0_3px_rgba(237,233,254,1)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-lightning-yellow-600 text-white shadow-sm hover:bg-lightning-yellow-600/90 active:bg-lightning-yellow-700",
        destructive:
          "bg-red-700 text-white shadow-sm hover:bg-red-600 active:bg-red-800 focus-visible:shadow-[0_0_0_3px_rgba(254,226,226,1)]",
        outline:
          "border border-gray-200 bg-background shadow-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100",
        secondary:
          "border border-gray-200 bg-white text-gray-950 shadow-sm hover:bg-gray-50 active:bg-gray-100",
        ghost: "hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
        link: "text-blue-violet-800 hover:text-blue-violet-800 active:text-blue-violet-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        xs: "h-8 rounded-md gap-1.5 px-2 has-[>svg]:px-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
