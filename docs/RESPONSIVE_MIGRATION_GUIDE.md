# Responsive Design Migration Guide

This guide helps developers migrate existing components to use the new responsive design system.

## Quick Migration Checklist

- [ ] Replace custom media queries with responsive hooks
- [ ] Update containers to use ResponsiveContainer
- [ ] Ensure touch targets are minimum 44px
- [ ] Add mobile-specific layouts where needed
- [ ] Test on mobile, tablet, and desktop
- [ ] Verify dark mode support
- [ ] Check accessibility (keyboard, screen reader)

## Common Migration Patterns

### 1. Replace Custom Media Queries

#### Before
```tsx
import { useEffect, useState } from "react";

function MyComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

#### After
```tsx
import { useIsMobile } from "@/hooks";

function MyComponent() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### 2. Replace Manual Containers

#### Before
```tsx
function MyComponent() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {children}
    </div>
  );
}
```

#### After
```tsx
import ResponsiveContainer from "@/components/ui/responsive-container";

function MyComponent() {
  return (
    <ResponsiveContainer maxWidth="7xl" padding="default">
      {children}
    </ResponsiveContainer>
  );
}
```

### 3. Replace Manual Grids

#### Before
```tsx
function CardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => <Card key={item.id} {...item} />)}
    </div>
  );
}
```

#### After
```tsx
import { ResponsiveGrid } from "@/components/ui/responsive-container";

function CardGrid() {
  return (
    <ResponsiveGrid
      cols={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap="default"
    >
      {items.map(item => <Card key={item.id} {...item} />)}
    </ResponsiveGrid>
  );
}
```

### 4. Replace Custom Modals

#### Before
```tsx
function MyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-black/50" onClick={onClose} />
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Content */}
      </div>
    </div>
  );
}
```

#### After
```tsx
import ResponsiveModal from "@/components/ui/responsive-modal";

function MyModal({ isOpen, onClose }) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Title"
      size="lg"
    >
      {/* Content */}
    </ResponsiveModal>
  );
}
```

### 5. Add Touch Gestures

#### Before
```tsx
function ImageGallery() {
  return (
    <div onClick={handleClick}>
      <img src={image} alt="Gallery" />
    </div>
  );
}
```

#### After
```tsx
import { useSwipeGesture } from "@/lib/utils/touch-utils";

function ImageGallery() {
  const swipeHandlers = useSwipeGesture((swipe) => {
    if (swipe.direction === "left") nextImage();
    if (swipe.direction === "right") previousImage();
  });

  return (
    <div onClick={handleClick} {...swipeHandlers}>
      <img src={image} alt="Gallery" />
    </div>
  );
}
```

### 6. Fix Touch Target Sizes

#### Before
```tsx
<button className="h-8 w-8 p-1">
  <Icon />
</button>
```

#### After
```tsx
import { getTouchTargetSize } from "@/lib/utils/touch-utils";

<button className={`${getTouchTargetSize("md")} flex items-center justify-center`}>
  <Icon />
</button>
```

Or with Tailwind:
```tsx
<button className="min-h-11 min-w-11 flex items-center justify-center">
  <Icon />
</button>
```

### 7. Add Responsive Values

#### Before
```tsx
function MyComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const columns = isMobile ? 1 : 3;

  return <div className={`grid grid-cols-${columns}`}>{/* ... */}</div>;
}
```

#### After
```tsx
import { useResponsiveValue } from "@/hooks";

function MyComponent() {
  const columns = useResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 3
  });

  return <div className={`grid grid-cols-${columns}`}>{/* ... */}</div>;
}
```

### 8. Improve Mobile Navigation

#### Before
```tsx
function Header() {
  return (
    <header>
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
```

#### After
```tsx
import { useState } from "react";
import { useIsMobile } from "@/hooks";
import MobileNav, { HamburgerButton } from "@/components/layout/mobile-nav";

const navItems = [
  { name: "Home", href: "/", icon: <HomeIcon /> },
  { name: "About", href: "/about", icon: <AboutIcon /> },
  { name: "Contact", href: "/contact", icon: <ContactIcon /> }
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header>
      {isMobile ? (
        <>
          <HamburgerButton
            isOpen={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <MobileNav
            items={navItems}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
          />
        </>
      ) : (
        <nav className="flex gap-4">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
```

## Component-Specific Migrations

### Tables → Responsive Tables

#### Before
```tsx
function DataTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td><button>Edit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

#### After
```tsx
import { useIsMobile } from "@/hooks";

function DataTable({ data }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map(row => (
          <div key={row.id} className="border rounded-lg p-4">
            <div className="font-semibold">{row.name}</div>
            <div className="text-sm text-zinc-600">{row.email}</div>
            <button className="mt-2 min-h-11 px-4">Edit</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table>
        {/* Desktop table */}
      </table>
    </div>
  );
}
```

### Forms → Responsive Forms

#### Before
```tsx
function ContactForm() {
  return (
    <form className="space-y-4">
      <div className="flex gap-4">
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
      </div>
      <input type="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### After
```tsx
import ResponsiveContainer, { ResponsiveFlex } from "@/components/ui/responsive-container";

function ContactForm() {
  return (
    <ResponsiveContainer maxWidth="2xl">
      <form className="space-y-6">
        <ResponsiveFlex
          direction="row"
          mobileDirection="col"
          gap="default"
        >
          <input
            type="text"
            placeholder="First Name"
            className="h-12 px-4 text-base flex-1"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="h-12 px-4 text-base flex-1"
          />
        </ResponsiveFlex>
        <input
          type="email"
          placeholder="Email"
          className="h-12 px-4 text-base w-full"
        />
        <button
          type="submit"
          className="h-12 px-6 w-full sm:w-auto"
        >
          Submit
        </button>
      </form>
    </ResponsiveContainer>
  );
}
```

### Images → Responsive Images

#### Before
```tsx
function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map(img => (
        <img
          key={img.id}
          src={img.url}
          alt={img.alt}
        />
      ))}
    </div>
  );
}
```

#### After
```tsx
import Image from "next/image";
import { ResponsiveCardGrid } from "@/components/ui/responsive-container";

function ImageGallery({ images }) {
  return (
    <ResponsiveCardGrid minCardWidth="280px">
      {images.map(img => (
        <div key={img.id} className="aspect-square relative">
          <Image
            src={img.url}
            alt={img.alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </ResponsiveCardGrid>
  );
}
```

## Dark Mode Migration

### Add Dark Mode Support

#### Before
```tsx
<div className="bg-white text-black border border-gray-300">
```

#### After
```tsx
<div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800">
```

### Common Dark Mode Classes

| Element | Light | Dark |
|---------|-------|------|
| Background | `bg-white` | `dark:bg-zinc-950` |
| Secondary BG | `bg-zinc-50` | `dark:bg-zinc-900` |
| Text | `text-zinc-900` | `dark:text-zinc-50` |
| Secondary Text | `text-zinc-600` | `dark:text-zinc-400` |
| Border | `border-zinc-200` | `dark:border-zinc-800` |
| Hover BG | `hover:bg-zinc-100` | `dark:hover:bg-zinc-800` |

## Testing Your Migration

### 1. Visual Testing

```bash
# Test at different breakpoints
- 320px (small mobile)
- 640px (tablet)
- 1024px (desktop)
- 1920px (large desktop)
```

### 2. Touch Testing

```tsx
// Add this temporarily to test touch targets
<div className="outline outline-1 outline-red-500">
  <button className="min-h-11 min-w-11">
    {/* Should have red outline showing 44px minimum */}
  </button>
</div>
```

### 3. Keyboard Testing

- Tab through all interactive elements
- Press Enter/Space on buttons
- Press Escape to close modals
- Navigate with arrow keys where applicable

### 4. Screen Reader Testing

- VoiceOver (Mac): Cmd + F5
- NVDA (Windows): Free download
- Check all ARIA labels are present

## Common Issues & Solutions

### Issue: Hydration Mismatch

```tsx
// ❌ Problem
function MyComponent() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

```tsx
// ✅ Solution
function MyComponent() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton />; // or null
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### Issue: Touch Targets Too Small

```tsx
// ❌ Problem
<button className="h-8 w-8 p-1">

// ✅ Solution
<button className="min-h-11 min-w-11 p-2">
```

### Issue: iOS Input Zoom

```tsx
// ❌ Problem
<input className="text-sm" />

// ✅ Solution
<input className="text-base" /> {/* 16px on mobile */}
```

### Issue: Modal Not Scrolling

```tsx
// ❌ Problem
<div className="overflow-y-auto">

// ✅ Solution
<div
  className="overflow-y-auto"
  style={{ WebkitOverflowScrolling: "touch" }}
>
```

## Progressive Enhancement Strategy

### Phase 1: Critical Fixes
1. Fix touch target sizes (< 1 day)
2. Add mobile navigation (< 1 day)
3. Make forms mobile-friendly (< 1 day)

### Phase 2: Enhanced Experience
1. Add responsive containers (1-2 days)
2. Implement responsive modals (1 day)
3. Add touch gestures (1 day)

### Phase 3: Polish
1. Add animations and transitions (1 day)
2. Optimize images (1 day)
3. Add dark mode support (1-2 days)

### Phase 4: Testing
1. Device testing (2-3 days)
2. Accessibility audit (1 day)
3. Performance optimization (1 day)

## Rollback Strategy

If issues arise, you can safely rollback:

1. **Keep old components:** Original components still work
2. **Gradual migration:** Migrate page by page
3. **Feature flags:** Use environment variables
4. **A/B testing:** Test with subset of users

```tsx
// Feature flag example
const USE_NEW_RESPONSIVE = process.env.NEXT_PUBLIC_NEW_RESPONSIVE === "true";

function MyComponent() {
  if (USE_NEW_RESPONSIVE) {
    return <NewResponsiveComponent />;
  }
  return <LegacyComponent />;
}
```

## Best Practices

1. **Test on Real Devices**: Emulators aren't enough
2. **Start Small**: Migrate one component at a time
3. **Document Changes**: Update component docs
4. **Get Feedback**: Ask users about experience
5. **Monitor Performance**: Check Core Web Vitals
6. **Accessibility First**: Test with assistive tech
7. **Progressive Enhancement**: Mobile first, enhance up
8. **Consistent Patterns**: Use provided components

## Getting Help

- **Documentation:** [RESPONSIVE_DESIGN.md](../RESPONSIVE_DESIGN.md)
- **Quick Reference:** [RESPONSIVE_QUICK_REFERENCE.md](./RESPONSIVE_QUICK_REFERENCE.md)
- **Implementation Summary:** [RESPONSIVE_IMPLEMENTATION_SUMMARY.md](../RESPONSIVE_IMPLEMENTATION_SUMMARY.md)
- **Code Examples:** Look at header.tsx and modal components

## Migration Checklist Template

Use this for each component you migrate:

```markdown
## Component: [Name]

### Current State
- [ ] Mobile support: Yes/No/Partial
- [ ] Touch targets: Yes/No
- [ ] Dark mode: Yes/No
- [ ] Accessibility: Yes/No/Partial

### Migration Steps
- [ ] Replace custom media queries
- [ ] Update containers
- [ ] Fix touch targets
- [ ] Add responsive layouts
- [ ] Test mobile
- [ ] Test tablet
- [ ] Test desktop
- [ ] Test dark mode
- [ ] Test accessibility
- [ ] Document changes

### Testing Results
- Mobile (< 640px): ✓/✗
- Tablet (640-1023px): ✓/✗
- Desktop (≥ 1024px): ✓/✗
- Touch gestures: ✓/✗/N/A
- Keyboard nav: ✓/✗
- Screen reader: ✓/✗
- Dark mode: ✓/✗

### Notes
[Any issues or special considerations]
```

---

*Last updated: November 13, 2025*
