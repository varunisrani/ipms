/**
 * Error logging and monitoring utility
 * Provides comprehensive error tracking and reporting
 */

export interface ErrorLogEntry {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  errorType: 'runtime' | 'boundary' | 'network' | 'validation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 100;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error with context
   */
  public logError(
    error: Error,
    errorType: ErrorLogEntry['errorType'] = 'unknown',
    severity: ErrorLogEntry['severity'] = 'medium',
    metadata?: Record<string, any>
  ): void {
    const entry: ErrorLogEntry = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      errorType,
      severity,
      metadata,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${severity}] - ${errorType}`);
      console.error('Message:', error.message);
      if (error.stack) console.error('Stack:', error.stack);
      if (metadata) console.error('Metadata:', metadata);
      console.groupEnd();
    }

    // In production, you would send this to a logging service
    // e.g., Sentry, LogRocket, Datadog, etc.
    this.sendToLoggingService(entry);
  }

  /**
   * Send error to external logging service
   * In production, implement integration with your logging service
   */
  private sendToLoggingService(entry: ErrorLogEntry): void {
    // Only in production and critical errors
    if (process.env.NODE_ENV === 'production' && entry.severity === 'critical') {
      // TODO: Implement integration with logging service
      // Example: Sentry.captureException(entry);
      console.error('Critical error logged:', entry);
    }
  }

  /**
   * Get all logged errors
   */
  public getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON for debugging
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get error count by type
   */
  public getErrorStats(): Record<string, number> {
    return this.logs.reduce((acc, log) => {
      acc[log.errorType] = (acc[log.errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

/**
 * Helper function to determine error severity
 */
export function determineErrorSeverity(error: Error): ErrorLogEntry['severity'] {
  const message = error.message.toLowerCase();

  // Critical errors
  if (
    message.includes('out of memory') ||
    message.includes('maximum call stack') ||
    message.includes('fatal')
  ) {
    return 'critical';
  }

  // High severity
  if (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return 'high';
  }

  // Medium severity
  if (
    message.includes('not found') ||
    message.includes('invalid') ||
    message.includes('validation')
  ) {
    return 'medium';
  }

  // Low severity - default
  return 'low';
}

/**
 * Helper function to determine error type
 */
export function determineErrorType(error: Error): ErrorLogEntry['errorType'] {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return 'network';
  }

  if (message.includes('validation') || message.includes('invalid')) {
    return 'validation';
  }

  if (error.name === 'TypeError' || error.name === 'ReferenceError') {
    return 'runtime';
  }

  return 'unknown';
}

/**
 * Convenient wrapper to log errors
 */
export function logError(
  error: Error,
  context?: {
    type?: ErrorLogEntry['errorType'];
    severity?: ErrorLogEntry['severity'];
    metadata?: Record<string, any>;
  }
): void {
  const errorType = context?.type || determineErrorType(error);
  const severity = context?.severity || determineErrorSeverity(error);

  errorLogger.logError(error, errorType, severity, context?.metadata);
}
