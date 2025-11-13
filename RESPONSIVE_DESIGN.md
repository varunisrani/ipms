# IPMS Responsive Design Guide

This document outlines the responsive design patterns, components, and utilities implemented in the IPMS application using Next.js 16 and Tailwind CSS 4.

## Table of Contents

1. [Overview](#overview)
2. [Breakpoints](#breakpoints)
3. [Components](#components)
4. [Hooks](#hooks)
5. [Touch Utilities](#touch-utilities)
6. [Best Practices](#best-practices)
7. [Mobile-First Approach](#mobile-first-approach)
8. [Testing Guidelines](#testing-guidelines)

---

## Overview

The IPMS application implements a comprehensive responsive design system that provides optimal experiences across all device types:

- **Mobile (< 640px)**: Full-screen layouts, hamburger navigation, touch-optimized interactions
- **Tablet (640px - 1023px)**: Hybrid layouts, drawer navigation, flexible grids
- **Desktop (≥ 1024px)**: Traditional navigation, multi-column layouts, hover states
- **Large Desktop (≥ 1280px)**: Expanded layouts with maximum content width

### Key Features

- Mobile-first CSS approach
- Touch-friendly tap targets (minimum 44px)
- Progressive enhancement
- Dark mode support throughout
- Modern viewport units (dvh, svh)
- Container queries where appropriate
- PWA support with manifest

---

## Breakpoints

Following Tailwind CSS 4 default breakpoints:

```typescript
{
  mobile: "< 640px",      // sm breakpoint
  tablet: "640px - 1023px", // sm to lg
  desktop: "≥ 1024px",     // lg breakpoint
  largeDesktop: "≥ 1280px" // xl breakpoint
}
```

### Usage in Tailwind

```jsx
// Mobile-first approach
<div className="px-4 sm:px-6 lg:px-8">
  {/*
    - Mobile (default): 16px padding
    - Tablet (≥640px): 24px padding
    - Desktop (≥1024px): 32px padding
  */}
</div>
```

---

## Components

### 1. Mobile Navigation (`/components/layout/mobile-nav.tsx`)

Slide-in drawer navigation optimized for mobile and tablet devices.

**Features:**
- Smooth slide-in/out animations
- Touch-friendly 48px tap targets
- Auto-closes on route change
- Keyboard accessible (ESC to close)
- Backdrop with blur effect
- Active route indication

**Usage:**

```tsx
import MobileNav, { HamburgerButton } from "@/components/layout/mobile-nav";

const navItems = [
  { name: "Home", href: "/", icon: <HomeIcon /> },
  { name: "Upload", href: "/upload", icon: <UploadIcon /> }
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <HamburgerButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      <MobileNav
        items={navItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

### 2. Responsive Container (`/components/ui/responsive-container.tsx`)

Flexible container system with automatic spacing and width constraints.

**Components:**

#### ResponsiveContainer

Main container with configurable max-width and padding.

```tsx
<ResponsiveContainer
  maxWidth="7xl"           // sm, md, lg, xl, 2xl, 4xl, 5xl, 6xl, 7xl, full
  padding="default"        // none, tight, default, loose
  fullHeightMobile={false} // Full viewport height on mobile
  center={true}            // Center content horizontally
>
  {children}
</ResponsiveContainer>
```

#### ResponsiveGrid

Auto-adjusting grid layout.

```tsx
<ResponsiveGrid
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="default" // tight, default, loose
  minItemWidth="280px" // Optional: auto-fit grid
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

#### ResponsiveStack

Vertical stacking with consistent spacing.

```tsx
<ResponsiveStack
  spacing="default" // tight, default, loose
  dividers={false}  // Add dividers between items
>
  {children}
</ResponsiveStack>
```

#### ResponsiveFlex

Flexible layouts with direction control.

```tsx
<ResponsiveFlex
  direction="row"          // row, col
  mobileDirection="col"    // Override for mobile
  align="center"           // start, center, end, stretch
  justify="between"        // start, center, end, between, around
  gap="default"            // tight, default, loose
  wrap={false}
>
  {children}
</ResponsiveFlex>
```

#### ResponsiveSection

Full-width sections with inner containers.

```tsx
<ResponsiveSection
  background="primary"    // transparent, primary, secondary, accent
  maxWidth="7xl"
  padding="default"
>
  {children}
</ResponsiveSection>
```

#### ResponsiveCardGrid

Specialized grid for card layouts with auto-fit.

```tsx
<ResponsiveCardGrid minCardWidth="280px">
  {cards.map(card => <Card key={card.id} {...card} />)}
</ResponsiveCardGrid>
```

### 3. Responsive Modal (`/components/ui/responsive-modal.tsx`)

Modal component that adapts to screen size.

**Features:**
- Full-screen on mobile with slide-up animation
- Centered dialog on desktop
- Swipe-down to close on mobile
- Touch-optimized close buttons (44px)
- Proper focus management
- Keyboard accessible

**Usage:**

```tsx
import ResponsiveModal, {
  ResponsiveModalActions,
  ResponsiveBottomSheet
} from "@/components/ui/responsive-modal";

<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Photo Details"
  size="lg"                    // sm, md, lg, xl, full
  swipeToClose={true}          // Enable swipe gesture on mobile
  forceFullScreen={false}      // Force full-screen even on desktop
  footer={
    <ResponsiveModalActions align="end">
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary">Save</Button>
    </ResponsiveModalActions>
  }
>
  <p>Modal content goes here</p>
</ResponsiveModal>

{/* Alternative: Bottom Sheet */}
<ResponsiveBottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Options"
  maxHeight="90vh"
>
  <div className="space-y-4">
    {/* Sheet content */}
  </div>
</ResponsiveBottomSheet>
```

### 4. Enhanced Header (`/components/layout/header.tsx`)

Responsive header with mobile navigation integration.

**Features:**
- Sticky positioning
- Backdrop blur effect
- Hamburger menu on mobile/tablet
- Desktop navigation on large screens
- Centered logo on mobile
- Proper touch target sizes

---

## Hooks

### 1. useMediaQuery (`/hooks/use-media-query.ts`)

Low-level hook for detecting media query matches.

```tsx
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLandscape,
  useIsPortrait,
  useIsTouchDevice,
  usePrefersReducedMotion,
  usePrefersDarkMode
} from "@/hooks/use-media-query";

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLandscape = useIsLandscape();
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Custom media query
  const isSmallHeight = useMediaQuery("(max-height: 600px)");

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### 2. useResponsive (`/hooks/use-responsive.ts`)

High-level hook providing comprehensive responsive state.

```tsx
import {
  useResponsive,
  useResponsiveValue,
  useIsMobileDevice,
  useWindowSize
} from "@/hooks/use-responsive";

function MyComponent() {
  const {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait,
    isTouchDevice,
    breakpoint,        // "mobile" | "tablet" | "desktop" | "largeDesktop"
    screenSize         // { width, height, breakpoint }
  } = useResponsive();

  // Get different values based on breakpoint
  const columns = useResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 3
  });

  // Check if mobile-sized (includes portrait tablets)
  const isMobileDevice = useIsMobileDevice();

  // Get current window size
  const { width, height } = useWindowSize();

  return (
    <div className={`grid grid-cols-${columns}`}>
      {/* Content */}
    </div>
  );
}
```

**Best Practices:**
- Use `useResponsive()` for most cases (comprehensive state)
- Use specific hooks like `useIsMobile()` for simple checks
- Always handle SSR (hooks return false during server render)
- Use `useResponsiveValue()` for conditional values

---

## Touch Utilities

Comprehensive touch interaction utilities at `/lib/utils/touch-utils.ts`.

### TouchGestureHandler

Class for handling swipe gestures.

```tsx
import { TouchGestureHandler, useSwipeGesture } from "@/lib/utils/touch-utils";

// React Hook
function SwipeableCard() {
  const swipeHandlers = useSwipeGesture(
    (swipe) => {
      console.log(`Swiped ${swipe.direction}`);
      console.log(`Distance: ${swipe.distance}px`);
      console.log(`Velocity: ${swipe.velocity}px/ms`);
    },
    {
      minSwipeDistance: 50,  // Minimum distance in px
      maxSwipeTime: 300,     // Maximum time in ms
      preventScroll: false   // Prevent scrolling during swipe
    }
  );

  return (
    <div {...swipeHandlers}>
      Swipe me!
    </div>
  );
}
```

### Long Press Detection

```tsx
import { detectLongPress } from "@/lib/utils/touch-utils";

function LongPressButton() {
  const longPressHandlers = detectLongPress(
    () => {
      console.log("Long press detected!");
    },
    500 // Duration in ms
  );

  return (
    <button {...longPressHandlers}>
      Long press me
    </button>
  );
}
```

### Touch Target Sizing

```tsx
import { getTouchTargetSize } from "@/lib/utils/touch-utils";

function TouchButton() {
  return (
    <button className={`${getTouchTargetSize("md")} rounded-lg`}>
      {/*
        Ensures minimum 44px touch target
        - sm: 44px (min-h-11 min-w-11)
        - md: 48px (min-h-12 min-w-12)
        - lg: 56px (min-h-14 min-w-14)
      */}
      Tap me
    </button>
  );
}
```

### Haptic Feedback

```tsx
import { triggerHapticFeedback } from "@/lib/utils/touch-utils";

function HapticButton() {
  const handleClick = () => {
    triggerHapticFeedback("medium"); // "light", "medium", "heavy"
    // Perform action
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Prevent Pull-to-Refresh

```tsx
import { preventPullToRefresh } from "@/lib/utils/touch-utils";
import { useEffect, useRef } from "react";

function ScrollableContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cleanup = preventPullToRefresh(containerRef.current);
      return cleanup;
    }
  }, []);

  return (
    <div ref={containerRef} className="overflow-y-auto">
      {/* Scrollable content */}
    </div>
  );
}
```

### Additional Utilities

```tsx
import {
  supportsHover,
  getTouchSpacing,
  momentumScrollStyles,
  createTouchScroll
} from "@/lib/utils/touch-utils";

// Check if device supports hover
if (supportsHover()) {
  // Enable hover effects
}

// Get optimal spacing for device
const spacing = getTouchSpacing("comfortable"); // "comfortable" | "compact"

// Apply momentum scrolling styles
<div style={momentumScrollStyles}>
  {/* Smooth kinetic scrolling */}
</div>

// Create custom touch scroll
useEffect(() => {
  if (containerRef.current) {
    const cleanup = createTouchScroll(containerRef.current);
    return cleanup;
  }
}, []);
```

---

## Best Practices

### 1. Mobile-First Approach

Always start with mobile styles and progressively enhance for larger screens.

```tsx
// ✅ Good: Mobile-first
<div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

// ❌ Avoid: Desktop-first
<div className="px-8 py-12 sm:px-6 sm:py-8 mobile:px-4 mobile:py-6">
```

### 2. Touch Target Sizes

Ensure all interactive elements meet minimum touch target requirements.

```tsx
// ✅ Good: Minimum 44px touch target
<button className="min-h-11 min-w-11 p-2">

// ❌ Avoid: Too small for touch
<button className="h-6 w-6 p-1">
```

### 3. Responsive Typography

Use fluid typography that scales appropriately.

```tsx
// ✅ Good: Responsive text sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// ✅ Good: Responsive line height
<p className="text-base leading-relaxed sm:text-lg sm:leading-loose">
```

### 4. Spacing & Layout

Use consistent spacing that adapts to screen size.

```tsx
// ✅ Good: Responsive spacing
<div className="space-y-4 sm:space-y-6 lg:space-y-8">

// ✅ Good: Responsive grid gaps
<div className="grid gap-4 sm:gap-6 lg:gap-8">
```

### 5. Images & Media

Ensure images are responsive and optimized.

```tsx
// ✅ Good: Responsive image with Next.js Image
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Patient photo"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// ✅ Good: Aspect ratio container
<div className="aspect-video w-full bg-zinc-100">
  <img src="/photo.jpg" alt="Photo" className="object-cover w-full h-full" />
</div>
```

### 6. Navigation Patterns

Use appropriate navigation for each screen size.

```tsx
// ✅ Good: Conditional navigation
{isMobile ? (
  <MobileNav items={navItems} />
) : (
  <DesktopNav items={navItems} />
)}

// ✅ Good: Hide desktop nav on mobile
<nav className="hidden lg:flex">

// ✅ Good: Show mobile menu button only on mobile
<button className="lg:hidden">
```

### 7. Modals & Overlays

Adapt modal behavior based on screen size.

```tsx
// ✅ Good: Full-screen on mobile, dialog on desktop
<ResponsiveModal
  isOpen={isOpen}
  onClose={onClose}
  title="Details"
  size="lg" // Desktop size
  swipeToClose={true} // Mobile gesture
>
```

### 8. Forms

Make forms touch-friendly and well-spaced on mobile.

```tsx
// ✅ Good: Responsive form layout
<form className="space-y-4 sm:space-y-6">
  <input
    type="text"
    className="w-full h-12 px-4 text-base sm:h-11 sm:text-sm"
  />
  <button
    type="submit"
    className="w-full h-12 sm:w-auto sm:h-11 sm:px-6"
  >
    Submit
  </button>
</form>
```

### 9. Tables

Use responsive table patterns for mobile.

```tsx
// ✅ Good: Stack on mobile, table on desktop
<div className="block sm:hidden">
  {/* Card-based layout for mobile */}
  {data.map(item => <Card key={item.id} {...item} />)}
</div>

<div className="hidden sm:block overflow-x-auto">
  <table className="min-w-full">
    {/* Traditional table for desktop */}
  </table>
</div>
```

### 10. Dark Mode

Ensure dark mode works across all breakpoints.

```tsx
// ✅ Good: Dark mode support
<div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">

// ✅ Good: Responsive dark mode borders
<div className="border border-zinc-200 sm:border-zinc-300 dark:border-zinc-800 dark:sm:border-zinc-700">
```

---

## Mobile-First Approach

### Core Principles

1. **Start Small**: Design for mobile first, then enhance
2. **Progressive Enhancement**: Add features as screen size increases
3. **Performance**: Smaller screens = more network constraints
4. **Touch-First**: Assume touch input, enhance for mouse/keyboard

### Implementation Pattern

```tsx
function ResponsiveComponent() {
  return (
    <div className="
      /* Mobile: Base styles (default) */
      flex flex-col gap-4 p-4

      /* Tablet: sm breakpoint (≥640px) */
      sm:flex-row sm:gap-6 sm:p-6

      /* Desktop: lg breakpoint (≥1024px) */
      lg:gap-8 lg:p-8

      /* Large Desktop: xl breakpoint (≥1280px) */
      xl:gap-10 xl:p-10
    ">
      {/* Content */}
    </div>
  );
}
```

### Breakpoint Guidelines

| Breakpoint | Width | Use Case |
|------------|-------|----------|
| Default (mobile) | < 640px | Single column, stacked layout, full-width elements |
| sm (tablet) | ≥ 640px | Two columns, side-by-side elements, smaller padding |
| md | ≥ 768px | Enhanced tablet layouts |
| lg (desktop) | ≥ 1024px | Multi-column layouts, sidebar navigation |
| xl (large desktop) | ≥ 1280px | Wider containers, more breathing room |
| 2xl | ≥ 1536px | Maximum width constraints |

---

## Testing Guidelines

### 1. Device Testing

Test on real devices when possible:

- **iPhone SE** (375x667) - Smallest modern mobile
- **iPhone 14 Pro** (393x852) - Standard mobile
- **iPad Mini** (744x1133) - Small tablet
- **iPad Pro** (1024x1366) - Large tablet
- **Desktop** (1920x1080) - Standard desktop

### 2. Browser DevTools

Use responsive design mode:

```bash
# Chrome DevTools
Cmd/Ctrl + Shift + M

# Firefox Responsive Design Mode
Cmd/Ctrl + Shift + M
```

Test these specific widths:
- 320px (small mobile)
- 375px (iPhone SE)
- 414px (iPhone Plus)
- 640px (tablet breakpoint)
- 768px (medium tablet)
- 1024px (desktop breakpoint)
- 1280px (large desktop)

### 3. Orientation Testing

Test both portrait and landscape:

```tsx
// Use landscape hook
const isLandscape = useIsLandscape();

// Apply landscape-specific styles
<div className="h-screen landscape:h-auto">
```

### 4. Touch Testing

- Test all interactive elements with touch (not just mouse)
- Verify minimum 44px tap targets
- Test swipe gestures
- Test long press interactions
- Verify scroll performance

### 5. Accessibility Testing

- Test with screen readers (VoiceOver, TalkBack)
- Verify keyboard navigation
- Check color contrast ratios
- Test with reduced motion preference
- Verify focus indicators are visible

### 6. Performance Testing

```bash
# Lighthouse Mobile Audit
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Mobile

# Test Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
```

### 7. Dark Mode Testing

Test both light and dark modes at all breakpoints:

```tsx
// Toggle dark mode in browser
document.documentElement.classList.toggle('dark')
```

---

## Common Patterns

### 1. Responsive Card Grid

```tsx
<ResponsiveCardGrid minCardWidth="280px">
  {photos.map(photo => (
    <Card key={photo.id}>
      <Image src={photo.url} alt={photo.title} />
      <h3 className="text-lg sm:text-xl">{photo.title}</h3>
      <p className="text-sm sm:text-base">{photo.description}</p>
    </Card>
  ))}
</ResponsiveCardGrid>
```

### 2. Responsive Dashboard Layout

```tsx
<ResponsiveContainer>
  <ResponsiveStack spacing="loose">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
      Dashboard
    </h1>

    <ResponsiveGrid
      cols={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap="default"
    >
      <StatCard title="Total Photos" value="1,234" />
      <StatCard title="Storage Used" value="45.2 GB" />
      <StatCard title="Active Patients" value="89" />
    </ResponsiveGrid>

    <ResponsiveSection background="secondary">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Recent Uploads
      </h2>
      {/* Content */}
    </ResponsiveSection>
  </ResponsiveStack>
</ResponsiveContainer>
```

### 3. Responsive Form

```tsx
<ResponsiveContainer maxWidth="2xl">
  <form className="space-y-6">
    <ResponsiveFlex
      direction="col"
      gap="default"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <FormField label="First Name" name="firstName" />
        <FormField label="Last Name" name="lastName" />
      </div>

      <FormField label="Email" name="email" type="email" />

      <ResponsiveModalActions align="end">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Submit</Button>
      </ResponsiveModalActions>
    </ResponsiveFlex>
  </form>
</ResponsiveContainer>
```

### 4. Responsive Image Gallery

```tsx
<div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
  {images.map((image, index) => (
    <button
      key={image.id}
      onClick={() => openModal(index)}
      className={`
        relative aspect-square overflow-hidden rounded-lg
        ${getTouchTargetSize('lg')}
        hover:opacity-80 transition-opacity
      `}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
    </button>
  ))}
</div>
```

---

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)
- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

---

## Troubleshooting

### Hydration Mismatches

If you see hydration errors with responsive hooks:

```tsx
// ✅ Solution: Use mounted state
function MyComponent() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingState />;
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### Touch Events Not Working

Ensure you're using the correct event handlers:

```tsx
// ✅ React synthetic events
<div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

// ❌ Native events (use useEffect instead)
element.addEventListener('touchstart', handler)
```

### Modal Not Scrolling on iOS

Apply momentum scrolling:

```tsx
<div
  className="overflow-y-auto"
  style={{ WebkitOverflowScrolling: 'touch' }}
>
```

---

## Version History

- **v1.0.0** (2025-11-13): Initial responsive design implementation
  - Mobile navigation with hamburger menu
  - Responsive container components
  - Media query and responsive hooks
  - Touch utilities and gesture detection
  - Responsive modal with swipe gestures
  - PWA manifest configuration
  - Enhanced header with mobile support

---

## Contributing

When adding new responsive features:

1. Follow mobile-first approach
2. Ensure minimum 44px touch targets
3. Test on multiple devices and orientations
4. Add dark mode support
5. Document new patterns in this guide
6. Update type definitions
7. Add tests for new utilities

---

*For questions or issues, please refer to the main project documentation or open an issue on GitHub.*
