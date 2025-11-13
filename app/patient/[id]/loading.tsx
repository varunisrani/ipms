import { Skeleton } from '@/components/ui/skeleton';
import { DetailedStatsCardSkeleton, DateSelectorSkeleton, MediaGridSkeleton } from '@/components/skeletons';

/**
 * Patient Detail Page Loading State
 * Displays skeleton loaders while patient data is being fetched
 */
export default function PatientDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <DetailedStatsCardSkeleton />
        <DetailedStatsCardSkeleton />
        <DetailedStatsCardSkeleton />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Date Selector Skeleton */}
        <div className="lg:col-span-1">
          <Skeleton className="h-10 w-full rounded-lg mb-4" />
          <DateSelectorSkeleton />
        </div>

        {/* Media Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <MediaGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
