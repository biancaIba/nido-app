import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 rounded-xl border border-shark-gray-200 bg-white p-6 shadow-sm dark:border-shark-gray-800 dark:bg-shark-gray-950">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
