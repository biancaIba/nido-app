import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-shark-gray-200/50 dark:bg-shark-gray-900/50",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
