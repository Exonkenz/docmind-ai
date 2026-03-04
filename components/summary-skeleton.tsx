import { Skeleton } from '@/components/ui/skeleton';

export function SummarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Reading Level Selector Skeleton */}
      <div className="bg-card border border-border rounded-lg p-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="space-y-4">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
