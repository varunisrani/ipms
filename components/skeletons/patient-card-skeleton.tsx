import { Skeleton, SkeletonCircle } from '@/components/ui/skeleton';

/**
 * PatientCardSkeleton component
 * Loading placeholder for PatientCard - matches the layout of patient cards
 */
export function PatientCardSkeleton() {
  return (
    <div className="block rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="h-12 w-12" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Files row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-5 w-8" />
        </div>

        {/* Dates row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-5 w-8" />
        </div>

        {/* Storage row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Updated row */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * PatientCardSkeletonGrid component
 * Multiple patient card skeletons in a grid layout
 */
export function PatientCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PatientCardSkeleton key={i} />
      ))}
    </div>
  );
}
