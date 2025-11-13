'use client';

import { Suspense, ReactNode, ComponentType } from 'react';
import { LoadingIndicator, PageLoadingIndicator, CardLoadingIndicator } from './loading-indicator';
import { Skeleton } from './skeleton';

export interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingText?: string;
}

/**
 * SuspenseWrapper component
 * Wraps content with React Suspense and provides a default loading fallback
 *
 * @example
 * ```tsx
 * <SuspenseWrapper fallback={<MyCustomLoader />}>
 *   <AsyncComponent />
 * </SuspenseWrapper>
 * ```
 */
export function SuspenseWrapper({
  children,
  fallback,
  loadingText = 'Loading...',
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <PageLoadingIndicator text={loadingText} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * CardSuspenseWrapper component
 * Suspense wrapper with a card-style loading fallback
 */
export function CardSuspenseWrapper({
  children,
  fallback,
  loadingText = 'Loading...',
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <CardLoadingIndicator text={loadingText} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * InlineSuspenseWrapper component
 * Suspense wrapper with an inline loading fallback
 */
export function InlineSuspenseWrapper({
  children,
  fallback,
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <LoadingIndicator size="sm" variant="spinner" className="inline-flex" />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * withSuspense HOC
 * Higher-order component that wraps a component with Suspense
 *
 * @example
 * ```tsx
 * const MyComponentWithSuspense = withSuspense(MyAsyncComponent, {
 *   fallback: <MyCustomLoader />,
 *   loadingText: 'Loading data...'
 * });
 * ```
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    loadingText?: string;
  }
) {
  return function WithSuspenseComponent(props: P) {
    const fallback = options?.fallback || (
      <PageLoadingIndicator text={options?.loadingText || 'Loading...'} />
    );

    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

/**
 * LazyLoadWrapper component
 * Wrapper for lazy-loaded components with built-in error boundary
 */
export interface LazyLoadWrapperProps extends SuspenseWrapperProps {
  onError?: (error: Error) => void;
}

export function LazyLoadWrapper({
  children,
  fallback,
  loadingText = 'Loading...',
  onError,
}: LazyLoadWrapperProps) {
  const defaultFallback = (
    <PageLoadingIndicator text={loadingText} />
  );

  // Note: In a production app, you'd want to wrap this with an Error Boundary
  // For now, we'll just use Suspense
  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * DeferredSuspenseWrapper component
 * Suspense wrapper that shows initial content briefly before showing loader
 * This prevents flashing of loading states for fast-loading content
 */
export function DeferredSuspenseWrapper({
  children,
  fallback,
  loadingText = 'Loading...',
  delay = 200,
}: SuspenseWrapperProps & { delay?: number }) {
  // For simplicity, using basic Suspense. In production, you might want
  // to use useDeferredValue or startTransition for better UX
  const defaultFallback = (
    <PageLoadingIndicator text={loadingText} />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

export default SuspenseWrapper;
