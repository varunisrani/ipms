import Link from 'next/link';
import { HardDrive, Home, ArrowLeft, Database, Trash2, BarChart3 } from 'lucide-react';

/**
 * Storage Not Found Page
 * Displayed when a user navigates to a non-existent storage route
 */
export default function StorageNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Storage Not Found Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
            <HardDrive className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Storage Page Not Found
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          The storage page you're looking for doesn't exist.
          <br />
          Let's get you to the storage management page.
        </p>

        {/* Main Storage Card */}
        <div className="mb-8 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm dark:border-purple-900 dark:from-purple-950/50 dark:to-purple-900/50">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white">
              <HardDrive className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-purple-900 dark:text-purple-50">
            Manage Your Storage
          </h3>
          <p className="mb-4 text-sm text-purple-700 dark:text-purple-300">
            Monitor usage, cleanup old files, and optimize storage tiers
          </p>
          <Link
            href="/storage"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            <HardDrive className="h-4 w-4" />
            Go to Storage Management
          </Link>
        </div>

        {/* Storage Features */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Storage Stats
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              View usage analytics
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Storage Tiers
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Optimize file tiers
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Cleanup Tools
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Remove old files
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Need help managing storage?{' '}
            <Link href="/storage" className="font-medium text-purple-600 hover:underline dark:text-purple-400">
              Visit the storage management page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
