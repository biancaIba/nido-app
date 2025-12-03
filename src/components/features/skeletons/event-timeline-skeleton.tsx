import { Skeleton } from "@/components/ui/skeleton";

export function EventTimelineSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Simulate 5-7 timeline items */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline connector simulation */}
          <div className="flex flex-col items-center">
            {/* Event icon placeholder */}
            <Skeleton className="h-10 w-10 rounded-full" />
            {/* Vertical line */}
            {i !== 5 && (
              <div className="mt-2 h-full w-0.5 bg-shark-gray-100 dark:bg-shark-gray-800" />
            )}
          </div>

          <div className="flex-1 space-y-2 pb-6">
            {/* Timestamp */}
            <Skeleton className="h-3 w-16" />

            {/* Event card */}
            <div className="rounded-xl border border-shark-gray-100 bg-white p-4 shadow-sm space-y-3 dark:border-shark-gray-800 dark:bg-shark-gray-950">
              {/* Event title/details */}
              <Skeleton className="h-4 w-3/4" />
              {/* Comment/description */}
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
