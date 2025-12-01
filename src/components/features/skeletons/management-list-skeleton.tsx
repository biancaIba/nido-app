import { Skeleton } from "@/components/ui/skeleton";

export function ManagementListSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-45 sm:hidden" />
              </div>
            </div>
            <Skeleton className="hidden h-4 w-40 sm:block" />
            <Skeleton className="hidden h-6 w-16 rounded-full sm:block" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
