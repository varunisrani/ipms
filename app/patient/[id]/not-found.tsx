'use client';

import Link from 'next/link';
import { UserX, Home, Search, Upload, ArrowLeft, Users } from 'lucide-react';

/**
 * Patient Not Found Page
 * Displayed when a user navigates to a non-existent patient ID
 */
export default function PatientNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Patient Not Found Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <UserX className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Patient Not Found
        </h1>
        <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
          We couldn't find a patient with that ID.
          <br />
          The patient may have been removed or the ID may be incorrect.
        </p>

        {/* Info Box */}
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
          <h3 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
            What could have happened?
          </h3>
          <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
            <li>• The patient ID may have been entered incorrectly</li>
            <li>• The patient record may have been deleted</li>
            <li>• The patient may not exist in the system yet</li>
            <li>• The URL may be outdated or incorrect</li>
          </ul>
        </div>

        {/* Action Cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="group flex flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-transform group-hover:scale-110 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">
                View All Patients
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Browse the complete patient list
              </p>
            </div>
          </Link>

          <Link
            href="/upload"
            className="group flex flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-green-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-green-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-transform group-hover:scale-110 dark:bg-green-900/20">
              <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">
                Add New Patient
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Upload files for a new patient
              </p>
            </div>
          </Link>
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
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Search className="h-4 w-4" />
            <span>
              Try searching for the patient by name or ID on the{' '}
              <Link href="/" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                dashboard
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
