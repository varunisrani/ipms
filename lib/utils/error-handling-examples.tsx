/**
 * Error Handling Examples
 * This file contains examples of how to use the error handling utilities
 * in the IPMS application.
 */

import { ErrorBoundary, withErrorBoundary } from '@/components/error-boundary';
import { logError } from '@/lib/utils/error-logger';

// ============================================================================
// Example 1: Basic Error Boundary Usage
// ============================================================================

/**
 * Wrap any component with ErrorBoundary to catch errors
 */
export function ExampleWithBasicErrorBoundary() {
  return (
    <ErrorBoundary context="Example Component">
      <YourComponent />
    </ErrorBoundary>
  );
}

// ============================================================================
// Example 2: Error Boundary with Custom Fallback
// ============================================================================

/**
 * Provide custom fallback UI for errors
 */
export function ExampleWithCustomFallback() {
  return (
    <ErrorBoundary
      context="Custom Fallback Example"
      fallback={
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-900">Custom Error Message</h3>
          <p className="text-sm text-red-700">Something went wrong in this component.</p>
        </div>
      }
    >
      <YourComponent />
    </ErrorBoundary>
  );
}

// ============================================================================
// Example 3: Error Boundary with Custom Error Handler
// ============================================================================

/**
 * Handle errors with custom logic
 */
export function ExampleWithCustomHandler() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Custom error handling logic
    console.log('Custom error handler:', error, errorInfo);
    // Could send to analytics, show toast, etc.
  };

  return (
    <ErrorBoundary context="Custom Handler Example" onError={handleError}>
      <YourComponent />
    </ErrorBoundary>
  );
}

// ============================================================================
// Example 4: Higher-Order Component (HOC) Pattern
// ============================================================================

/**
 * Use HOC pattern to wrap components with error boundary
 */
const SafeComponent = withErrorBoundary(YourComponent, {
  context: 'HOC Wrapped Component',
  showDetails: true,
});

export function ExampleWithHOC() {
  return <SafeComponent />;
}

// ============================================================================
// Example 5: Manual Error Logging in Try-Catch
// ============================================================================

/**
 * Log errors manually in async operations
 */
export async function exampleAsyncOperation() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    // Log error with context
    logError(error as Error, {
      type: 'network',
      severity: 'high',
      metadata: {
        operation: 'fetchData',
        timestamp: new Date().toISOString(),
      },
    });
    throw error; // Re-throw if needed
  }
}

// ============================================================================
// Example 6: Error Logging in Event Handlers
// ============================================================================

/**
 * Log errors in event handlers
 */
export function ExampleWithEventHandler() {
  const handleClick = () => {
    try {
      // Some operation that might fail
      performRiskyOperation();
    } catch (error) {
      logError(error as Error, {
        type: 'runtime',
        severity: 'medium',
        metadata: {
          action: 'button_click',
          component: 'ExampleComponent',
        },
      });
      // Show user-friendly message
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <button onClick={handleClick} className="btn">
      Click Me
    </button>
  );
}

// ============================================================================
// Example 7: Nested Error Boundaries
// ============================================================================

/**
 * Use nested error boundaries for granular error handling
 */
export function ExampleWithNestedBoundaries() {
  return (
    <ErrorBoundary context="Parent Component">
      <div className="parent-component">
        <ErrorBoundary context="Left Panel">
          <LeftPanel />
        </ErrorBoundary>

        <ErrorBoundary context="Right Panel">
          <RightPanel />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

// ============================================================================
// Example 8: Error Boundary in Layout
// ============================================================================

/**
 * Wrap sections of layout with error boundaries
 */
export function ExampleLayoutWithErrorBoundaries() {
  return (
    <div className="layout">
      <ErrorBoundary context="Header">
        <Header />
      </ErrorBoundary>

      <ErrorBoundary context="Main Content">
        <main>{/* Your content */}</main>
      </ErrorBoundary>

      <ErrorBoundary context="Footer">
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

// ============================================================================
// Example 9: Form Validation Error Handling
// ============================================================================

/**
 * Handle form validation errors
 */
export function ExampleFormValidation() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Form validation
      const formData = new FormData(e.target as HTMLFormElement);
      validateFormData(formData);

      // Submit form
      await submitForm(formData);
    } catch (error) {
      logError(error as Error, {
        type: 'validation',
        severity: 'low',
        metadata: {
          form: 'example_form',
          timestamp: new Date().toISOString(),
        },
      });
      // Show validation error to user
    }
  };

  return (
    <ErrorBoundary context="Form Component">
      <form onSubmit={handleSubmit}>{/* Form fields */}</form>
    </ErrorBoundary>
  );
}

// ============================================================================
// Example 10: API Error Handling with Error Logger
// ============================================================================

/**
 * Comprehensive API error handling
 */
export async function exampleApiCall() {
  try {
    const response = await fetch('/api/endpoint');

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const err = error as Error;

    // Determine error severity based on error type
    const severity = err.message.includes('404')
      ? 'low'
      : err.message.includes('500')
        ? 'critical'
        : 'high';

    logError(err, {
      type: 'network',
      severity,
      metadata: {
        endpoint: '/api/endpoint',
        method: 'GET',
        timestamp: new Date().toISOString(),
      },
    });

    throw error;
  }
}

// ============================================================================
// Dummy Components for Examples
// ============================================================================

function YourComponent() {
  return <div>Your Component</div>;
}

function LeftPanel() {
  return <div>Left Panel</div>;
}

function RightPanel() {
  return <div>Right Panel</div>;
}

function Header() {
  return <header>Header</header>;
}

function Footer() {
  return <footer>Footer</footer>;
}

function performRiskyOperation() {
  // Dummy function
}

function validateFormData(formData: FormData) {
  // Dummy validation
}

async function submitForm(formData: FormData) {
  // Dummy submit
}
