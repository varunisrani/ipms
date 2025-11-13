import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | IPMS",
  description: "Integrated Patient Management System - Patient Photo Management Dashboard",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome to IPMS
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Integrated Patient Management System - Manage patient photos securely and efficiently
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/upload"
          className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Upload Photos
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload patient photos with metadata and automatic processing
          </p>
        </Link>

        <Link
          href="/storage"
          className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Storage Management
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Monitor storage usage and manage photo lifecycle policies
          </p>
        </Link>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <svg
              className="h-6 w-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Analytics
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            View storage statistics and usage patterns
          </p>
          <span className="mt-4 inline-block text-xs text-zinc-500 dark:text-zinc-500">
            Coming soon
          </span>
        </div>
      </div>

      <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quick Stats
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Photos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              0
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Storage Used</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              0 GB
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Patients</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
