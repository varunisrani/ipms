'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logError } from '@/lib/utils/error-logger';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Handler
 * Catches errors that occur outside the root layout (including layout errors)
 * Must define its own <html> and <body> tags
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    logError(error, {
      type: 'boundary',
      severity: 'critical',
      metadata: {
        digest: error.digest,
        location: 'global',
        note: 'Critical error caught by global error boundary',
      },
    });
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
          <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-white p-8 shadow-2xl dark:border-red-900 dark:bg-zinc-950">
            {/* Critical Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-12 w-12 animate-pulse text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Title */}
            <div className="text-center">
              <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Critical Error
              </h1>
              <p className="mb-2 text-lg text-zinc-700 dark:text-zinc-300">
                A critical error occurred in the application.
              </p>
              <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
                This is a serious issue. Please try refreshing the page or returning to the home page.
              </p>
            </div>

            {/* Error Message */}
            <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
              <h3 className="mb-2 text-sm font-semibold text-red-900 dark:text-red-100">
                Error Details:
              </h3>
              <p className="font-mono text-sm text-red-700 dark:text-red-300">
                {error.message || 'An unknown error occurred'}
              </p>
              {error.digest && (
                <div className="mt-3 border-t border-red-200 pt-3 dark:border-red-900">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    <span className="font-semibold">Error ID:</span>{' '}
                    <code className="rounded bg-red-100 px-2 py-1 dark:bg-red-900/50">
                      {error.digest}
                    </code>
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                <Home className="h-4 w-4" />
                Go to Home Page
              </a>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </button>
            </div>

            {/* Critical Help Section */}
            <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/50">
                <h4 className="mb-2 text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  What you can do:
                </h4>
                <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>• Try refreshing your browser</li>
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Return to the home page and try again</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
                {error.digest && (
                  <p className="mt-3 text-xs text-yellow-700 dark:text-yellow-300">
                    Please provide the Error ID above when contacting support.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                IPMS - Integrated Patient Management System
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
