import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

/**
 * StatsCardSkeleton component
 * Loading placeholder for statistics cards on the dashboard
 */
export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
        <SkeletonCircle className="h-12 w-12" />
      </div>
    </div>
  );
}

/**
 * StatsCardWithProgressSkeleton component
 * Loading placeholder for stats cards with progress bars (like storage usage)
 */
export function StatsCardWithProgressSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
        <SkeletonCircle className="h-12 w-12" />
      </div>
      <div className="mt-3 space-y-1">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

/**
 * StatsCardSkeletonGrid component
 * Multiple stats cards in a grid layout
 */
export function StatsCardSkeletonGrid({
  count = 3,
  withProgress = false
}: {
  count?: number;
  withProgress?: boolean;
}) {
  const CardComponent = withProgress ? StatsCardWithProgressSkeleton : StatsCardSkeleton;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
}

/**
 * DetailedStatsCardSkeleton component
 * Loading placeholder for detailed stats cards (patient detail page)
 */
export function DetailedStatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-20 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
