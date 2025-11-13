import { Skeleton } from '@/components/ui/skeleton';

/**
 * Upload Page Loading State
 * Displays skeleton loaders while the upload page is being loaded
 */
export default function UploadLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Upload Area Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient ID Input Section */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* File Uploader Section */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-64 mx-auto mb-4" />
              <Skeleton className="h-10 w-32 mx-auto rounded-lg" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-24 rounded-lg" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {/* Guidelines sections */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-1 ml-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
