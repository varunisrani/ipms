'use client';

import { useState } from 'react';
import { Bug, Bomb, AlertTriangle } from 'lucide-react';

/**
 * Error Test Component
 * Use this component in development to test error boundaries
 * DO NOT use in production
 */
export function ErrorTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (shouldThrow) {
    throw new Error('Test error: Error boundary is working correctly!');
  }

  const throwRenderError = () => {
    setShouldThrow(true);
  };

  const throwAsyncError = async () => {
    // This will not be caught by error boundary (use try-catch)
    throw new Error('Async error - this should be caught with try-catch');
  };

  const throwEventError = () => {
    // This will not be caught by error boundary (use try-catch)
    throw new Error('Event handler error - this should be caught with try-catch');
  };

  const triggerNetworkError = async () => {
    try {
      await fetch('/api/nonexistent-endpoint');
    } catch (error) {
      console.error('Network error caught:', error);
      alert('Network error triggered (check console)');
    }
  };

  const trigger404 = () => {
    window.location.href = '/nonexistent-page';
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-red-500 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/50">
      <div className="mb-4 flex items-center gap-2">
        <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
        <h3 className="font-semibold text-red-900 dark:text-red-100">
          Development Error Testing
        </h3>
      </div>

      <div className="mb-4 space-y-2 text-sm text-red-800 dark:text-red-200">
        <p className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>This component is only visible in development mode.</span>
        </p>
        <p className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>Use these buttons to test different error scenarios.</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={throwRenderError}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Throw Render Error
        </button>

        <button
          onClick={throwEventError}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Throw Event Error
        </button>

        <button
          onClick={throwAsyncError}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Throw Async Error
        </button>

        <button
          onClick={triggerNetworkError}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Trigger Network Error
        </button>

        <button
          onClick={trigger404}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Trigger 404 Error
        </button>

        <button
          onClick={() => {
            // Simulate undefined access
            const obj: any = null;
            console.log(obj.property);
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
        >
          <Bomb className="h-4 w-4" />
          Trigger TypeError
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-red-300 bg-red-100 p-3 dark:border-red-900 dark:bg-red-900/50">
        <p className="text-xs text-red-800 dark:text-red-200">
          <strong>Note:</strong> Error boundaries only catch errors in:
        </p>
        <ul className="mt-1 space-y-1 text-xs text-red-700 dark:text-red-300">
          <li>• Render methods</li>
          <li>• Lifecycle methods (class components)</li>
          <li>• Constructors</li>
        </ul>
        <p className="mt-2 text-xs text-red-800 dark:text-red-200">
          They do <strong>NOT</strong> catch:
        </p>
        <ul className="mt-1 space-y-1 text-xs text-red-700 dark:text-red-300">
          <li>• Event handlers (use try-catch)</li>
          <li>• Async code (use try-catch)</li>
          <li>• Server-side rendering errors</li>
          <li>• Errors in the error boundary itself</li>
        </ul>
      </div>
    </div>
  );
}

export default ErrorTest;
