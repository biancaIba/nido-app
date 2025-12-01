import { Card, Skeleton } from "@/components/ui";

export function EventRegistrationFormSkeleton() {
  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-12 w-full px-2" />
        <Skeleton className="mx-auto h-9 w-full px-2" />
      </div>

      {/* Category Icons Grid (6 items) */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card
            key={i}
            className="relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
          >
            <div className="flex flex-col items-center p-4 space-y-3">
              <Skeleton className="h-12 w-12 rounded-full" />

              <Skeleton className="h-3 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
