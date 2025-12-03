import { Skeleton } from "@/components/ui";
import { EventTimelineSkeleton } from "./event-timeline-skeleton";

export function TeacherDashboardSkeleton() {
  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm mb-4">
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="rounded-lg bg-white p-4 mb-2">
        <div className="flex mt-4 h-16 space-x-2 justify-between items-center">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2 flex flex-col justify-center items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <EventTimelineSkeleton />
    </div>
  );
}
