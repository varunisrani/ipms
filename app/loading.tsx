import {
  StatsCardSkeletonGrid,
  StatsCardWithProgressSkeleton,
  PatientCardSkeletonGrid,
} from '@/components/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dashboard Loading State
 * Displays skeleton loaders while the dashboard data is being fetched
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCardSkeletonGrid count={2} />
        <StatsCardWithProgressSkeleton />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-32 mt-4" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Patient List Section Skeleton */}
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>

        <PatientCardSkeletonGrid count={6} />
      </div>
    </div>
  );
}
