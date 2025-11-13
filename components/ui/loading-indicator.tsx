'use client';

import { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

/**
 * LoadingIndicator component
 * Displays various loading states for buttons and actions
 *
 * @example
 * ```tsx
 * <LoadingIndicator size="md" text="Loading..." />
 * <LoadingIndicator variant="dots" />
 * <LoadingIndicator fullScreen text="Please wait..." />
 * ```
 */
export function LoadingIndicator({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
  ...props
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div
      className={`flex items-center justify-center gap-2 ${fullScreen ? 'h-full w-full' : ''} ${className}`}
      {...props}
    >
      {variant === 'spinner' && (
        <Loader2 className={`${sizeClasses[size]} animate-spin text-current`} />
      )}

      {variant === 'dots' && (
        <div className="flex items-center gap-1">
          <div className={`${sizeClasses[size]} rounded-full bg-current opacity-75 animate-bounce [animation-delay:-0.3s]`} />
          <div className={`${sizeClasses[size]} rounded-full bg-current opacity-75 animate-bounce [animation-delay:-0.15s]`} />
          <div className={`${sizeClasses[size]} rounded-full bg-current opacity-75 animate-bounce`} />
        </div>
      )}

      {variant === 'pulse' && (
        <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse`} />
      )}

      {text && (
        <span className={`${textSizeClasses[size]} text-current`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * InlineLoadingIndicator component
 * Compact loading indicator for inline use
 */
export function InlineLoadingIndicator({ text }: { text?: string }) {
  return (
    <LoadingIndicator
      size="sm"
      variant="spinner"
      text={text}
      className="inline-flex"
    />
  );
}

/**
 * ButtonLoadingIndicator component
 * Loading indicator specifically designed for buttons
 */
export function ButtonLoadingIndicator() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * PageLoadingIndicator component
 * Full-page loading state with centered spinner
 */
export function PageLoadingIndicator({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingIndicator
        size="lg"
        text={text}
        className="text-zinc-600 dark:text-zinc-400"
      />
    </div>
  );
}

/**
 * CardLoadingIndicator component
 * Loading state for card components
 */
export function CardLoadingIndicator({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 dark:border-zinc-800 dark:bg-zinc-950">
      <LoadingIndicator
        size="md"
        text={text}
        className="text-zinc-600 dark:text-zinc-400"
      />
    </div>
  );
}

export default LoadingIndicator;
