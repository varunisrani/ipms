# Responsive Design Quick Reference

A quick reference guide for implementing responsive design patterns in IPMS.

## Quick Start

### Import Hooks

```tsx
// Basic responsive check
import { useIsMobile, useIsTablet, useIsDesktop } from "@/hooks";

// Comprehensive state
import { useResponsive } from "@/hooks";

// Get responsive values
import { useResponsiveValue } from "@/hooks";
```

### Basic Pattern

```tsx
function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

## Breakpoint Reference

| Breakpoint | Width | Tailwind Prefix |
|------------|-------|-----------------|
| Mobile | < 640px | (default) |
| Tablet | ≥ 640px | `sm:` |
| Medium | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Large | ≥ 1280px | `xl:` |
| X-Large | ≥ 1536px | `2xl:` |

## Common Patterns

### 1. Responsive Container

```tsx
import ResponsiveContainer from "@/components/ui/responsive-container";

<ResponsiveContainer maxWidth="7xl" padding="default">
  {children}
</ResponsiveContainer>
```

### 2. Responsive Grid

```tsx
import { ResponsiveGrid } from "@/components/ui/responsive-container";

<ResponsiveGrid
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="default"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

### 3. Responsive Modal

```tsx
import ResponsiveModal from "@/components/ui/responsive-modal";

<ResponsiveModal
  isOpen={isOpen}
  onClose={onClose}
  title="Title"
  size="lg"
>
  {content}
</ResponsiveModal>
```

### 4. Mobile Navigation

```tsx
import MobileNav, { HamburgerButton } from "@/components/layout/mobile-nav";

<HamburgerButton isOpen={isOpen} onClick={toggle} />
<MobileNav items={navItems} isOpen={isOpen} onClose={close} />
```

## Touch Utilities

### Swipe Gestures

```tsx
import { useSwipeGesture } from "@/lib/utils/touch-utils";

const swipeHandlers = useSwipeGesture((swipe) => {
  console.log(swipe.direction); // "left" | "right" | "up" | "down"
});

<div {...swipeHandlers}>Swipeable content</div>
```

### Long Press

```tsx
import { detectLongPress } from "@/lib/utils/touch-utils";

const longPressHandlers = detectLongPress(() => {
  console.log("Long press!");
}, 500);

<button {...longPressHandlers}>Press and hold</button>
```

### Touch Target Sizing

```tsx
import { getTouchTargetSize } from "@/lib/utils/touch-utils";

<button className={getTouchTargetSize("md")}>
  {/* Ensures minimum 48px touch target */}
</button>
```

## Spacing Patterns

### Mobile-First Padding

```tsx
// Progressive enhancement
<div className="p-4 sm:p-6 lg:p-8">

// Horizontal only
<div className="px-4 sm:px-6 lg:px-8">

// Vertical only
<div className="py-4 sm:py-6 lg:py-8">
```

### Gap Spacing

```tsx
// Flex gap
<div className="flex gap-4 sm:gap-6 lg:gap-8">

// Grid gap
<div className="grid gap-4 sm:gap-6 lg:gap-8">

// Stack gap
<div className="space-y-4 sm:space-y-6 lg:space-y-8">
```

## Typography

### Responsive Text Sizes

```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
<h2 className="text-xl sm:text-2xl lg:text-3xl">
<h3 className="text-lg sm:text-xl lg:text-2xl">
<p className="text-base sm:text-lg">
<small className="text-sm sm:text-base">
```

### Line Heights

```tsx
<p className="leading-relaxed sm:leading-loose">
```

## Layout Patterns

### Show/Hide by Breakpoint

```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Show on mobile, hide on desktop
<div className="block lg:hidden">

// Show only on tablet
<div className="hidden sm:block lg:hidden">
```

### Flex Direction

```tsx
// Column on mobile, row on desktop
<div className="flex flex-col lg:flex-row">

// Row on mobile, column on desktop
<div className="flex flex-row lg:flex-col">
```

### Grid Columns

```tsx
// 1 col mobile, 2 cols tablet, 3 cols desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

// Auto-fit responsive grid
<div className="grid" style={{
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
}}>
```

## Touch-Friendly Sizes

### Button Minimum Heights

```tsx
// Small: 44px (minimum)
<button className="min-h-11">

// Medium: 48px
<button className="min-h-12">

// Large: 56px
<button className="min-h-14">
```

### Input Heights

```tsx
// Mobile
<input className="h-12 text-base">

// Desktop
<input className="h-11 text-sm sm:h-11 sm:text-sm">
```

## Conditional Rendering

### useResponsive Hook

```tsx
const {
  isMobile,      // < 640px
  isTablet,      // 640px - 1023px
  isDesktop,     // ≥ 1024px
  isLandscape,   // landscape orientation
  isPortrait,    // portrait orientation
  isTouchDevice, // supports touch
  breakpoint,    // "mobile" | "tablet" | "desktop"
  screenSize     // { width, height, breakpoint }
} = useResponsive();
```

### useResponsiveValue Hook

```tsx
const columns = useResponsiveValue({
  mobile: 1,
  tablet: 2,
  desktop: 3
});

<div className={`grid grid-cols-${columns}`}>
```

## Dark Mode Support

### Basic Pattern

```tsx
<div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
```

### Borders

```tsx
<div className="border border-zinc-200 dark:border-zinc-800">
```

### Backgrounds

```tsx
// Primary
<div className="bg-white dark:bg-zinc-950">

// Secondary
<div className="bg-zinc-50 dark:bg-zinc-900">

// Accent
<div className="bg-blue-50 dark:bg-blue-950/20">
```

## Image Optimization

### Next.js Image

```tsx
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority={false}
/>
```

### Aspect Ratio

```tsx
// 16:9 aspect ratio
<div className="aspect-video">
  <img src="/photo.jpg" className="w-full h-full object-cover" />
</div>

// Square aspect ratio
<div className="aspect-square">
  <img src="/photo.jpg" className="w-full h-full object-cover" />
</div>
```

## Common Components

### Card Layout

```tsx
<div className="
  bg-white dark:bg-zinc-900
  border border-zinc-200 dark:border-zinc-800
  rounded-lg
  p-4 sm:p-6
  shadow-sm hover:shadow-md
  transition-shadow
">
  {content}
</div>
```

### Form Layout

```tsx
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    <input className="h-12 px-4 text-base" />
    <input className="h-12 px-4 text-base" />
  </div>
  <button className="w-full sm:w-auto h-12 px-6">
    Submit
  </button>
</form>
```

### Navigation

```tsx
// Desktop navigation
<nav className="hidden lg:flex items-center gap-6">
  <Link href="/">Home</Link>
</nav>

// Mobile navigation trigger
<button className="lg:hidden min-h-11 min-w-11">
  ☰
</button>
```

## Accessibility

### Focus States

```tsx
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
">
```

### ARIA Labels

```tsx
<button
  aria-label="Close menu"
  aria-expanded={isOpen}
>
```

### Keyboard Navigation

```tsx
// Handle Escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [onClose]);
```

## Performance Tips

1. **Use CSS over JS** when possible
2. **Debounce resize listeners** (built into hooks)
3. **Use proper image sizes** with Next.js Image
4. **Implement lazy loading** for off-screen content
5. **Minimize layout shifts** (CLS)

## Testing Checklist

- [ ] Test on real mobile devices
- [ ] Test portrait and landscape orientations
- [ ] Test touch interactions (tap, swipe, long press)
- [ ] Test with keyboard navigation
- [ ] Test dark mode at all breakpoints
- [ ] Test with reduced motion preference
- [ ] Verify minimum 44px touch targets
- [ ] Check text readability at all sizes
- [ ] Verify focus indicators are visible
- [ ] Test form inputs on iOS (zoom prevention)

## Common Issues & Solutions

### Hydration Mismatch

```tsx
// Problem: Server renders desktop, client is mobile
// Solution: Use mounted state
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <LoadingSkeleton />;
```

### iOS Input Zoom

```tsx
// Solution: Ensure 16px minimum font size
<input className="text-base" /> {/* 16px on mobile */}
```

### Touch Event Not Working

```tsx
// Use React synthetic events
<div
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
```

### Modal Not Scrolling on iOS

```tsx
// Apply momentum scrolling
<div
  className="overflow-y-auto"
  style={{ WebkitOverflowScrolling: "touch" }}
>
```

## Resources

- [Full Documentation](../RESPONSIVE_DESIGN.md)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/)

---

*Last updated: 2025-11-13*
