# Error Handling Documentation

This document describes the comprehensive error handling system implemented for the IPMS application.

## Overview

The IPMS application now includes a robust error handling system that catches and manages errors gracefully across the entire application, providing user-friendly error messages and recovery options.

## Components

### 1. Error Logging Utility

**Location:** `/home/user/ipms/lib/utils/error-logger.ts`

A singleton error logger that tracks and reports errors throughout the application.

**Features:**
- Centralized error logging
- Error categorization by type (runtime, boundary, network, validation)
- Severity levels (low, medium, high, critical)
- Development vs. production logging
- Error statistics and analytics
- Export functionality for debugging

**Usage:**
```typescript
import { logError } from '@/lib/utils/error-logger';

try {
  // Your code
} catch (error) {
  logError(error as Error, {
    type: 'network',
    severity: 'high',
    metadata: { endpoint: '/api/data' }
  });
}
```

### 2. Custom Error Boundary Component

**Location:** `/home/user/ipms/components/error-boundary.tsx`

A reusable React Error Boundary component that can be wrapped around any part of your component tree.

**Features:**
- Catches React errors in child components
- Customizable fallback UI
- Error recovery mechanisms
- Development mode error details
- HOC pattern support

**Usage:**
```typescript
import ErrorBoundary from '@/components/error-boundary';

<ErrorBoundary context="My Feature">
  <YourComponent />
</ErrorBoundary>
```

**With Custom Fallback:**
```typescript
<ErrorBoundary
  context="My Feature"
  fallback={<div>Custom error message</div>}
>
  <YourComponent />
</ErrorBoundary>
```

**HOC Pattern:**
```typescript
import { withErrorBoundary } from '@/components/error-boundary';

const SafeComponent = withErrorBoundary(MyComponent, {
  context: 'My Component',
  showDetails: true
});
```

### 3. Root Error Boundary

**Location:** `/home/user/ipms/app/error.tsx`

Next.js App Router error boundary that catches errors at the root level.

**Features:**
- Beautiful error UI with Tailwind CSS
- Try again functionality
- Navigation options
- Error ID for support
- Development mode error details
- Dark mode support

### 4. Global Error Boundary

**Location:** `/home/user/ipms/app/global-error.tsx`

Catches critical errors that occur outside the root layout, including layout errors.

**Features:**
- Must define its own `<html>` and `<body>` tags
- Handles critical application failures
- Provides recovery options
- User-friendly guidance

### 5. Not Found Pages

Custom 404 pages for better user experience:

#### Root Not Found
**Location:** `/home/user/ipms/app/not-found.tsx`

- General 404 page for any non-existent route
- Quick links to main sections
- Search suggestions

#### Patient Not Found
**Location:** `/home/user/ipms/app/patient/[id]/not-found.tsx`

- Specific to patient routes
- Explains why patient might not be found
- Links to patient list and upload

#### Upload Not Found
**Location:** `/home/user/ipms/app/upload/not-found.tsx`

- Upload-specific 404 page
- Shows upload requirements
- Direct link to upload page

#### Storage Not Found
**Location:** `/home/user/ipms/app/storage/not-found.tsx`

- Storage-specific 404 page
- Highlights storage features
- Link to storage management

## Error Handling Hierarchy

```
1. Global Error (global-error.tsx) - Catches layout and critical errors
   ↓
2. Root Error (error.tsx) - Catches page-level errors
   ↓
3. Custom Error Boundaries - Catches component-level errors
   ↓
4. Try-Catch Blocks - Handles async and event handler errors
   ↓
5. Error Logger - Logs all errors for monitoring
```

## Best Practices

### When to Use Error Boundaries

✅ **DO use Error Boundaries for:**
- Component tree errors
- Render errors
- Lifecycle method errors
- Constructor errors
- Wrapping third-party components

❌ **DO NOT use Error Boundaries for:**
- Event handlers (use try-catch)
- Async code (use try-catch)
- Server-side rendering
- Errors in the error boundary itself

### When to Use Try-Catch

✅ **DO use Try-Catch for:**
- Event handlers
- Async operations
- API calls
- Form submissions
- Data fetching

### Error Logging

Always log errors with appropriate context:

```typescript
// Good - with context
logError(error, {
  type: 'network',
  severity: 'high',
  metadata: {
    operation: 'uploadFile',
    fileName: file.name,
    timestamp: new Date().toISOString()
  }
});

// Bad - no context
console.error(error);
```

### Error Severity Guidelines

- **Critical**: Application cannot function, requires immediate attention
  - Out of memory errors
  - Fatal API failures
  - Database connection failures

- **High**: Significant feature broken, requires prompt attention
  - Network failures
  - Authentication errors
  - Critical API errors

- **Medium**: Feature partially broken, should be addressed soon
  - Validation errors
  - Not found errors
  - Non-critical API errors

- **Low**: Minor issue, does not prevent usage
  - UI rendering issues
  - Non-essential feature failures

## Development Tools

### Error Test Component

**Location:** `/home/user/ipms/components/error-test.tsx`

A development-only component for testing error boundaries.

**Usage:**
```typescript
import { ErrorTest } from '@/components/error-test';

// Add to your page in development
{process.env.NODE_ENV === 'development' && <ErrorTest />}
```

### Error Handling Examples

**Location:** `/home/user/ipms/lib/utils/error-handling-examples.tsx`

Contains 10 comprehensive examples of different error handling patterns.

## Dark Mode Support

All error pages and components support dark mode using Tailwind CSS dark mode classes:
- Uses `dark:` prefix for dark mode styles
- Follows the existing IPMS color scheme (zinc palette)
- Maintains accessibility in both modes

## User Experience

### Error Recovery Options

All error pages provide multiple recovery options:
1. **Try Again** - Retry the failed operation
2. **Go Back** - Navigate to previous page
3. **Go Home** - Return to dashboard
4. **Reload Page** - Fresh start

### Error Messages

- **User-friendly**: Clear, non-technical language
- **Actionable**: Tell users what they can do
- **Helpful**: Provide links to related resources
- **Professional**: Maintain brand consistency

## Testing

To test the error handling system:

1. **Development Mode**: Use the `ErrorTest` component
2. **Manual Testing**:
   - Navigate to non-existent routes
   - Trigger network errors
   - Cause render errors
3. **Check Error Logs**:
   ```typescript
   import { errorLogger } from '@/lib/utils/error-logger';
   console.log(errorLogger.getLogs());
   ```

## Integration with Monitoring Services

The error logger is designed to integrate with external monitoring services. Update the `sendToLoggingService` method in `error-logger.ts`:

```typescript
private sendToLoggingService(entry: ErrorLogEntry): void {
  if (process.env.NODE_ENV === 'production') {
    // Sentry
    Sentry.captureException(entry);

    // Or LogRocket
    LogRocket.captureException(entry);

    // Or Datadog
    datadogLogs.logger.error(entry.message, entry);
  }
}
```

## Future Enhancements

Potential improvements to consider:

1. **Error Analytics Dashboard**: Visual display of error statistics
2. **User Feedback**: Allow users to report errors with context
3. **Automatic Retry**: Implement exponential backoff for network errors
4. **Error Boundaries per Route**: More granular error handling
5. **Custom Error Types**: Create typed error classes for better handling
6. **Performance Monitoring**: Track error impact on performance
7. **A/B Testing**: Test different error messages for better UX

## Support

For questions or issues with error handling:
1. Check this documentation
2. Review examples in `/lib/utils/error-handling-examples.tsx`
3. Test with `/components/error-test.tsx`
4. Contact the development team

## Related Files

- `/home/user/ipms/app/error.tsx` - Root error boundary
- `/home/user/ipms/app/global-error.tsx` - Global error handler
- `/home/user/ipms/app/not-found.tsx` - Root 404 page
- `/home/user/ipms/app/patient/[id]/not-found.tsx` - Patient 404 page
- `/home/user/ipms/app/upload/not-found.tsx` - Upload 404 page
- `/home/user/ipms/app/storage/not-found.tsx` - Storage 404 page
- `/home/user/ipms/components/error-boundary.tsx` - Custom error boundary
- `/home/user/ipms/components/error-test.tsx` - Testing component
- `/home/user/ipms/lib/utils/error-logger.ts` - Error logging utility
- `/home/user/ipms/lib/utils/error-handling-examples.tsx` - Usage examples
