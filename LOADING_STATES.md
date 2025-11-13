# Loading States Documentation

This document provides comprehensive guidance on implementing loading states across the IPMS application using modern Next.js 16 patterns.

## Table of Contents

1. [Overview](#overview)
2. [Skeleton Components](#skeleton-components)
3. [Route-Level Loading States](#route-level-loading-states)
4. [Loading Indicators](#loading-indicators)
5. [Suspense Wrappers](#suspense-wrappers)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Overview

The IPMS application uses a comprehensive loading state system that includes:

- **Skeleton screens** - Visual placeholders that match the layout of actual content
- **Route-level loading** - Next.js `loading.tsx` files for automatic route transitions
- **Loading indicators** - Spinners and animated loaders for actions and buttons
- **Suspense wrappers** - React Suspense utilities for lazy-loaded components

All components support:
- Dark mode
- Tailwind CSS animations (pulse, shimmer)
- Zinc color scheme consistency
- TypeScript typing

## Skeleton Components

### Base Skeleton Component

Location: `/components/ui/skeleton.tsx`

```tsx
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/ui/skeleton';

// Basic skeleton
<Skeleton className="h-4 w-32" />

// Circle skeleton (for avatars)
<SkeletonCircle className="h-12 w-12" />

// Text skeleton with multiple lines
<SkeletonText lines={3} />

// With shimmer animation
<Skeleton variant="shimmer" className="h-20 w-full rounded-lg" />
```

**Variants:**
- `default` - Static placeholder
- `pulse` - Pulsing animation (default)
- `shimmer` - Shimmer animation effect

### Specific Skeleton Components

Location: `/components/skeletons/`

#### Patient Card Skeleton

```tsx
import { PatientCardSkeleton, PatientCardSkeletonGrid } from '@/components/skeletons';

// Single patient card
<PatientCardSkeleton />

// Grid of patient cards
<PatientCardSkeletonGrid count={6} />
```

#### Media Grid Skeleton

```tsx
import { MediaGridSkeleton, MediaThumbnailSkeleton, MediaGridEmptySkeleton } from '@/components/skeletons';

// Full media grid
<MediaGridSkeleton count={8} />

// Single thumbnail
<MediaThumbnailSkeleton />

// Empty state
<MediaGridEmptySkeleton />
```

#### Stats Card Skeleton

```tsx
import {
  StatsCardSkeleton,
  StatsCardWithProgressSkeleton,
  StatsCardSkeletonGrid,
  DetailedStatsCardSkeleton
} from '@/components/skeletons';

// Basic stats card
<StatsCardSkeleton />

// Stats card with progress bar
<StatsCardWithProgressSkeleton />

// Grid of stats cards
<StatsCardSkeletonGrid count={3} />

// Detailed stats (patient detail page)
<DetailedStatsCardSkeleton />
```

#### File List Skeleton

```tsx
import {
  FileListSkeleton,
  FileListItemSkeleton,
  DateSelectorSkeleton,
  StorageStatsSkeleton
} from '@/components/skeletons';

// Full file list
<FileListSkeleton count={5} />

// Single file item
<FileListItemSkeleton />

// Date selector
<DateSelectorSkeleton />

// Storage statistics
<StorageStatsSkeleton />
```

## Route-Level Loading States

Next.js 16 automatically displays `loading.tsx` components while route segments are loading.

### Dashboard Loading

Location: `/app/loading.tsx`

Automatically shown when navigating to the dashboard. Includes:
- Header skeleton
- Stats cards (3 cards with one showing progress)
- Quick actions section
- Patient grid (6 cards)

### Upload Page Loading

Location: `/app/upload/loading.tsx`

Shown while the upload page loads. Includes:
- Patient ID input section
- File uploader drop zone
- Upload guidelines sidebar

### Patient Detail Loading

Location: `/app/patient/[id]/loading.tsx`

Displayed when loading patient details. Includes:
- Header with back button
- Stats cards (3 detailed cards)
- Date selector sidebar
- Media grid (8 thumbnails)

### Storage Page Loading

Location: `/app/storage/loading.tsx`

Shows while storage management page loads. Includes:
- Stats cards (4 cards)
- Storage meter
- Patient statistics
- Cleanup tools

## Loading Indicators

Location: `/components/ui/loading-indicator.tsx`

### Basic Loading Indicator

```tsx
import { LoadingIndicator } from '@/components/ui/loading-indicator';

// Spinner (default)
<LoadingIndicator size="md" text="Loading..." />

// Dots animation
<LoadingIndicator variant="dots" />

// Pulse animation
<LoadingIndicator variant="pulse" />

// Full screen
<LoadingIndicator fullScreen text="Please wait..." />
```

**Props:**
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `variant`: `'spinner' | 'dots' | 'pulse'` (default: `'spinner'`)
- `text`: Optional loading text
- `fullScreen`: Boolean for full-screen overlay

### Specialized Loading Indicators

```tsx
import {
  InlineLoadingIndicator,
  ButtonLoadingIndicator,
  PageLoadingIndicator,
  CardLoadingIndicator,
} from '@/components/ui/loading-indicator';

// Inline (compact for inline use)
<InlineLoadingIndicator text="Loading..." />

// Button (for use inside buttons)
<ButtonLoadingIndicator />

// Page level
<PageLoadingIndicator text="Loading page..." />

// Card level
<CardLoadingIndicator text="Loading data..." />
```

### Usage in Buttons

```tsx
import Button from '@/components/ui/button';

<Button isLoading disabled={isLoading}>
  {isLoading ? 'Uploading...' : 'Upload Files'}
</Button>

// Or with custom indicator
<Button disabled={isLoading}>
  {isLoading && <ButtonLoadingIndicator />}
  {isLoading ? 'Processing...' : 'Submit'}
</Button>
```

## Suspense Wrappers

Location: `/components/ui/suspense-wrapper.tsx`

### Basic Suspense Wrapper

```tsx
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper';

<SuspenseWrapper fallback={<CustomLoader />} loadingText="Loading data...">
  <AsyncComponent />
</SuspenseWrapper>
```

### Card Suspense Wrapper

```tsx
import { CardSuspenseWrapper } from '@/components/ui/suspense-wrapper';

<CardSuspenseWrapper loadingText="Loading card...">
  <AsyncCardContent />
</CardSuspenseWrapper>
```

### Inline Suspense Wrapper

```tsx
import { InlineSuspenseWrapper } from '@/components/ui/suspense-wrapper';

<InlineSuspenseWrapper>
  <AsyncInlineComponent />
</InlineSuspenseWrapper>
```

### Higher-Order Component Pattern

```tsx
import { withSuspense } from '@/components/ui/suspense-wrapper';

const MyComponentWithSuspense = withSuspense(MyAsyncComponent, {
  fallback: <CustomLoader />,
  loadingText: 'Loading data...'
});

// Use it
<MyComponentWithSuspense prop1="value" />
```

### Lazy Load Wrapper

```tsx
import { LazyLoadWrapper } from '@/components/ui/suspense-wrapper';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'));

<LazyLoadWrapper loadingText="Loading component...">
  <HeavyComponent />
</LazyLoadWrapper>
```

### Deferred Suspense

```tsx
import { DeferredSuspenseWrapper } from '@/components/ui/suspense-wrapper';

// Waits 200ms before showing loader (prevents flash for fast loads)
<DeferredSuspenseWrapper delay={200}>
  <FastLoadingComponent />
</DeferredSuspenseWrapper>
```

## Best Practices

### 1. Match Skeleton to Content Layout

Skeleton screens should closely match the actual content layout:

```tsx
// Bad: Generic skeleton
<Skeleton className="h-40 w-full" />

// Good: Matches actual patient card structure
<PatientCardSkeleton />
```

### 2. Use Route-Level Loading for Navigation

Next.js automatically shows `loading.tsx` during route transitions:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <PatientCardSkeletonGrid count={6} />;
}
```

### 3. Use Suspense for Async Components

Wrap async components with Suspense:

```tsx
import { Suspense } from 'react';
import { PatientList } from '@/components/patient-list';

<Suspense fallback={<PatientCardSkeletonGrid />}>
  <PatientList />
</Suspense>
```

### 4. Provide Meaningful Loading Text

```tsx
// Bad
<LoadingIndicator text="Loading..." />

// Good
<LoadingIndicator text="Loading patient data..." />
```

### 5. Use Appropriate Variants

- **Skeleton pulse**: For structural loading (cards, lists)
- **Skeleton shimmer**: For premium feel (hero sections)
- **Spinner**: For actions and quick loads
- **Dots**: For ongoing processes
- **Pulse**: For subtle waiting states

### 6. Avoid Loading State Flashing

For fast-loading content, use deferred loading:

```tsx
<DeferredSuspenseWrapper delay={200}>
  <FastComponent />
</DeferredSuspenseWrapper>
```

### 7. Consistent Sizing

Match skeleton sizes to actual content:

```tsx
// Match heading size
<Skeleton className="h-9 w-48" /> // text-3xl equivalent

// Match paragraph
<Skeleton className="h-5 w-96" /> // text-base equivalent
```

## Examples

### Example 1: Dashboard with Loading States

```tsx
'use client';

import { Suspense } from 'react';
import { PatientList } from '@/components/patient/patient-list';
import { PatientCardSkeletonGrid } from '@/components/skeletons';
import { StatsCards } from '@/components/stats-cards';
import { StatsCardSkeletonGrid } from '@/components/skeletons';

export default function DashboardPage() {
  return (
    <div>
      {/* Stats with Suspense */}
      <Suspense fallback={<StatsCardSkeletonGrid count={3} />}>
        <StatsCards />
      </Suspense>

      {/* Patient list with Suspense */}
      <Suspense fallback={<PatientCardSkeletonGrid count={6} />}>
        <PatientList />
      </Suspense>
    </div>
  );
}
```

### Example 2: Button with Loading State

```tsx
'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';

export function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadFiles();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      onClick={handleUpload}
      isLoading={isUploading}
      disabled={isUploading}
    >
      {isUploading ? 'Uploading...' : 'Upload Files'}
    </Button>
  );
}
```

### Example 3: Custom Loading Component

```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function CustomCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
```

### Example 4: Lazy-Loaded Component

```tsx
import dynamic from 'next/dynamic';
import { CardLoadingIndicator } from '@/components/ui/loading-indicator';

// Lazy load heavy component
const HeavyChart = dynamic(() => import('@/components/charts/heavy-chart'), {
  loading: () => <CardLoadingIndicator text="Loading chart..." />,
  ssr: false,
});

export function ChartPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <HeavyChart data={data} />
    </div>
  );
}
```

### Example 5: Streaming with Suspense

```tsx
import { Suspense } from 'react';
import { PatientStats } from '@/components/patient-stats';
import { RecentUploads } from '@/components/recent-uploads';
import { StatsCardSkeletonGrid, FileListSkeleton } from '@/components/skeletons';

export default function Dashboard() {
  return (
    <div>
      {/* Stats load first */}
      <Suspense fallback={<StatsCardSkeletonGrid count={3} />}>
        <PatientStats />
      </Suspense>

      {/* Recent uploads load independently */}
      <Suspense fallback={<FileListSkeleton count={5} />}>
        <RecentUploads />
      </Suspense>
    </div>
  );
}
```

## Animation Configuration

The shimmer animation is configured in `/app/globals.css`:

```css
@theme inline {
  /* Shimmer animation for skeleton loading states */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  --animate-shimmer: shimmer 2s ease-in-out infinite;
}
```

## Component Index

All loading components are exported from their respective index files:

```tsx
// UI components
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  LoadingIndicator,
  SuspenseWrapper,
} from '@/components/ui';

// Skeleton components
import {
  PatientCardSkeleton,
  MediaGridSkeleton,
  StatsCardSkeleton,
  FileListSkeleton,
} from '@/components/skeletons';
```

## TypeScript Support

All components are fully typed with TypeScript interfaces:

```tsx
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'pulse' | 'shimmer';
}

export interface LoadingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

export interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingText?: string;
}
```

## Troubleshooting

### Skeleton not showing animation

Make sure the shimmer animation is defined in `globals.css` and the Tailwind config includes the animation classes.

### Loading state flashing too quickly

Use `DeferredSuspenseWrapper` with a delay:

```tsx
<DeferredSuspenseWrapper delay={200}>
  <FastComponent />
</DeferredSuspenseWrapper>
```

### Dark mode not working

Ensure skeleton components use `dark:` variants:

```tsx
<Skeleton className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
```

### Route loading not showing

Make sure `loading.tsx` is at the correct route segment level and is a default export:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <LoadingSkeleton />;
}
```

## Resources

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)

---

**Last Updated:** 2025-11-13
**Version:** 1.0.0
