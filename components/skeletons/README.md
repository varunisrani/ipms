# Skeleton Components

This directory contains skeleton loading components that match the layout of actual content in the IPMS application.

## Available Components

### Patient Card Skeleton
- `PatientCardSkeleton` - Single patient card placeholder
- `PatientCardSkeletonGrid` - Grid of patient card skeletons

**Usage:**
```tsx
import { PatientCardSkeleton, PatientCardSkeletonGrid } from '@/components/skeletons';

<PatientCardSkeleton />
<PatientCardSkeletonGrid count={6} />
```

### Media Grid Skeleton
- `MediaGridSkeleton` - Full media grid with thumbnails
- `MediaThumbnailSkeleton` - Single thumbnail placeholder
- `MediaGridEmptySkeleton` - Empty state placeholder

**Usage:**
```tsx
import { MediaGridSkeleton, MediaThumbnailSkeleton } from '@/components/skeletons';

<MediaGridSkeleton count={8} />
<MediaThumbnailSkeleton />
```

### Stats Card Skeleton
- `StatsCardSkeleton` - Basic stats card
- `StatsCardWithProgressSkeleton` - Stats card with progress bar
- `StatsCardSkeletonGrid` - Grid of stats cards
- `DetailedStatsCardSkeleton` - Detailed stats card (patient detail page)

**Usage:**
```tsx
import { StatsCardSkeletonGrid, StatsCardWithProgressSkeleton } from '@/components/skeletons';

<StatsCardSkeletonGrid count={3} />
<StatsCardWithProgressSkeleton />
```

### File List Skeleton
- `FileListSkeleton` - List of file items
- `FileListItemSkeleton` - Single file item
- `DateSelectorSkeleton` - Date selector sidebar
- `StorageStatsSkeleton` - Storage statistics

**Usage:**
```tsx
import { FileListSkeleton, DateSelectorSkeleton } from '@/components/skeletons';

<FileListSkeleton count={5} />
<DateSelectorSkeleton />
```

## Design Guidelines

1. **Match Layout**: Skeleton components should match the exact layout and spacing of actual components
2. **Use Pulse**: Default to pulse animation for subtle loading states
3. **Dark Mode**: All skeletons support dark mode automatically
4. **Consistent Sizing**: Use the same dimensions as actual content

## Examples

### Dashboard Loading
```tsx
import { StatsCardSkeletonGrid, PatientCardSkeletonGrid } from '@/components/skeletons';

export default function DashboardLoading() {
  return (
    <div>
      <StatsCardSkeletonGrid count={3} />
      <PatientCardSkeletonGrid count={6} />
    </div>
  );
}
```

### With Suspense
```tsx
import { Suspense } from 'react';
import { MediaGridSkeleton } from '@/components/skeletons';
import { MediaGrid } from '@/components/media/media-grid';

<Suspense fallback={<MediaGridSkeleton count={8} />}>
  <MediaGrid files={files} />
</Suspense>
```

## See Also

- Base skeleton components: `/components/ui/skeleton.tsx`
- Loading indicators: `/components/ui/loading-indicator.tsx`
- Documentation: `/LOADING_STATES.md`
