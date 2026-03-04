import { Skeleton } from '@/components/ui/skeleton';

export function FindingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Bar Skeleton */}
      <div className="bg-card border border-border rounded-lg p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
      </div>

      {/* Count Skeleton */}
      <Skeleton className="h-4 w-48" />

      {/* Finding Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
