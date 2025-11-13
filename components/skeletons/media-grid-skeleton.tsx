import { Skeleton } from '@/components/ui/skeleton';

/**
 * MediaThumbnailSkeleton component
 * Loading placeholder for individual media thumbnail
 */
export function MediaThumbnailSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-md mb-3" />

      {/* File info */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

/**
 * MediaGridSkeleton component
 * Loading placeholder for MediaGrid - shows multiple thumbnail placeholders
 */
export function MediaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MediaThumbnailSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * MediaGridEmptySkeleton component
 * Loading placeholder for an empty media grid state
 */
export function MediaGridEmptySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Skeleton className="mb-4 h-16 w-16 rounded-full" />
      <Skeleton className="mb-2 h-6 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}
