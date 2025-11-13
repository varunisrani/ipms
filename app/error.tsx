'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, ArrowLeft } from 'lucide-react';
import { logError } from '@/lib/utils/error-logger';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary for the App Router
 * Catches errors in the app directory and provides recovery options
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error when component mounts
    logError(error, {
      type: 'boundary',
      severity: 'high',
      metadata: {
        digest: error.digest,
        location: 'root',
      },
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-white p-8 shadow-xl dark:border-red-900 dark:bg-zinc-950">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Oops! Something went wrong
          </h1>
          <p className="mb-2 text-lg text-zinc-700 dark:text-zinc-300">
            We encountered an unexpected error while processing your request.
          </p>
          <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            Don't worry, your data is safe. Please try again or contact support if the issue persists.
          </p>
        </div>

        {/* Error Details (Development Mode) */}
        {isDevelopment && (
          <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 flex items-center gap-2">
              <Bug className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Development Mode - Error Details:
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Error Message:
                </p>
                <p className="font-mono text-xs text-red-600 dark:text-red-400">
                  {error.message || 'Unknown error'}
                </p>
              </div>

              {error.digest && (
                <div>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Error Digest:
                  </p>
                  <p className="font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    {error.digest}
                  </p>
                </div>
              )}

              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Production Error ID */}
        {!isDevelopment && error.digest && (
          <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold">Error ID:</span>{' '}
              <code className="rounded bg-zinc-200 px-2 py-1 font-mono text-xs dark:bg-zinc-800">
                {error.digest}
              </code>
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Please include this ID when contacting support.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>

        {/* Help Section */}
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <div className="space-y-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p className="font-medium">Need help?</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="/"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Return to Dashboard
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="/storage"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Check Storage Status
              </a>
              <span className="hidden sm:inline">•</span>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
