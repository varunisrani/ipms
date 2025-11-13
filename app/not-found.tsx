'use client';

import Link from 'next/link';
import { FileQuestion, Home, Search, Upload, HardDrive, ArrowLeft } from 'lucide-react';

/**
 * Root Not Found Page
 * Displayed when a user navigates to a non-existent route
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* 404 Title */}
        <h1 className="mb-3 text-6xl font-bold text-zinc-900 dark:text-zinc-50">404</h1>
        <h2 className="mb-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          Page Not Found
        </h2>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          Sorry, we couldn't find the page you're looking for.
          <br />
          It may have been moved or deleted.
        </p>

        {/* Quick Links */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Here are some helpful links:
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Dashboard</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  View all patients
                </p>
              </div>
            </Link>

            <Link
              href="/upload"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-green-300 hover:bg-green-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-700 dark:hover:bg-green-950/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Upload Files</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Add patient photos
                </p>
              </div>
            </Link>

            <Link
              href="/storage"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-700 dark:hover:bg-purple-950/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <HardDrive className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Storage</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Manage storage
                </p>
              </div>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Go Back</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Previous page
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Search className="h-4 w-4" />
            <span>
              Looking for a specific patient?{' '}
              <Link href="/" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Search on the dashboard
              </Link>
            </span>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
