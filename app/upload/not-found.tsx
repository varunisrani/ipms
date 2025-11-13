import Link from 'next/link';
import { UploadCloud, Home, ArrowLeft, HelpCircle } from 'lucide-react';

/**
 * Upload Not Found Page
 * Displayed when a user navigates to a non-existent upload route
 */
export default function UploadNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Upload Not Found Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <UploadCloud className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Upload Page Not Found
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          The upload page you're looking for doesn't exist.
          <br />
          Let's get you to the right place.
        </p>

        {/* Main Upload Card */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm dark:border-blue-900 dark:from-blue-950/50 dark:to-blue-900/50">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
              <UploadCloud className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-50">
            Ready to Upload Files?
          </h3>
          <p className="mb-4 text-sm text-blue-700 dark:text-blue-300">
            Upload patient photos and documents securely
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <UploadCloud className="h-4 w-4" />
            Go to Upload Page
          </Link>
        </div>

        {/* Help Section */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-50">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-semibold">Upload Requirements</h3>
          </div>
          <div className="space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Supported formats: JPG, JPEG, PNG, PDF</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Maximum file size: 5MB per file</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Maximum files: 10 files at a time</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-600 dark:text-blue-400">✓</span>
              <span>Patient ID required for upload</span>
            </div>
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
      </div>
    </div>
  );
}
