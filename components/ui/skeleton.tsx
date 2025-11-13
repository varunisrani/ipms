import { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'pulse' | 'shimmer';
}

/**
 * Skeleton component for loading states
 * Provides animated placeholders that match the layout of actual content
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * <Skeleton variant="shimmer" className="h-20 w-full rounded-lg" />
 * ```
 */
export function Skeleton({
  className = '',
  variant = 'pulse',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    default: '',
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 bg-[length:200%_100%]',
  };

  const baseClasses = variant === 'shimmer'
    ? 'rounded-md'
    : 'rounded-md bg-zinc-200 dark:bg-zinc-800';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton circle variant for avatars
 */
export function SkeletonCircle({
  className = '',
  variant = 'pulse',
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant={variant}
      className={`rounded-full ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton text variant for inline text placeholders
 */
export function SkeletonText({
  lines = 1,
  className = '',
  variant = 'pulse',
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export default Skeleton;
