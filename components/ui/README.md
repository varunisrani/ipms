# UI Components Library

A comprehensive set of reusable UI components for the Patient Photo Management System, built with Next.js 16, React 19, and Tailwind CSS 4.

## Components

### 1. Button (`button.tsx`)

A flexible button component with multiple variants and sizes.

**Features:**
- 4 variants: `primary`, `secondary`, `danger`, `ghost`
- 3 sizes: `sm`, `md`, `lg`
- Loading state with spinner
- Full TypeScript support
- Accessible with ARIA attributes
- Focus ring for keyboard navigation

**Usage:**
```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="danger" isLoading>
  Loading...
</Button>
```

**Props:**
- `variant?: "primary" | "secondary" | "danger" | "ghost"` (default: "primary")
- `size?: "sm" | "md" | "lg"` (default: "md")
- `isLoading?: boolean` (default: false)
- All standard button HTML attributes

---

### 2. Card (`card.tsx`)

A card component with optional header, content, and footer sections.

**Features:**
- Composable with `Card`, `CardHeader`, `CardContent`, `CardFooter`
- Clean borders and shadows
- Responsive design
- Custom className support

**Usage:**
```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";

<Card>
  <CardHeader>
    <h3>Patient Information</h3>
  </CardHeader>
  <CardContent>
    <p>Patient details go here...</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

**Components:**
- `Card` - Main container
- `CardHeader` - Header section with bottom border
- `CardContent` - Main content area
- `CardFooter` - Footer section with top border and gray background

---

### 3. Input (`input.tsx`)

A form input component with label, error handling, and helper text.

**Features:**
- Optional label with required indicator
- Error state with red border and error message
- Helper text for additional guidance
- Full accessibility with ARIA attributes
- Auto-generated IDs
- Disabled state styling

**Usage:**
```tsx
import { Input } from "@/components/ui";

<Input
  label="Patient Name"
  placeholder="Enter patient name"
  required
  helperText="Full legal name"
/>

<Input
  label="Email"
  type="email"
  error="Invalid email format"
/>
```

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message (shows red border and error text)
- `helperText?: string` - Helper text below input
- `required?: boolean` - Shows asterisk on label
- All standard input HTML attributes

---

### 4. Modal (`modal.tsx`)

A modal dialog component with overlay and portal rendering.

**Features:**
- Portal rendering (renders outside DOM hierarchy)
- Overlay with backdrop
- Escape key to close
- Focus trap
- Body scroll lock when open
- Multiple sizes
- Optional close button
- Click outside to close (configurable)
- Accessible with ARIA attributes

**Usage:**
```tsx
import { Modal } from "@/components/ui";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="md"
      >
        <p>Are you sure you want to proceed?</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </div>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Close handler
- `title?: string` - Modal title
- `size?: "sm" | "md" | "lg" | "xl"` (default: "md")
- `closeOnOverlayClick?: boolean` (default: true)
- `showCloseButton?: boolean` (default: true)
- `className?: string` - Custom styles for modal container

---

### 5. Progress (`progress.tsx`)

A progress bar component with percentage display.

**Features:**
- Customizable colors
- Multiple sizes
- Optional percentage display
- Optional label
- Smooth animations
- Accessible with ARIA progressbar role

**Usage:**
```tsx
import { Progress } from "@/components/ui";

<Progress value={75} label="Upload Progress" />

<Progress
  value={45}
  max={100}
  color="green"
  size="lg"
  showPercentage
/>
```

**Props:**
- `value: number` - Current progress value
- `max?: number` (default: 100) - Maximum value
- `showPercentage?: boolean` (default: true) - Show percentage text
- `size?: "sm" | "md" | "lg"` (default: "md")
- `color?: "blue" | "green" | "red" | "yellow"` (default: "blue")
- `label?: string` - Label text

---

### 6. Badge (`badge.tsx`)

A badge component for displaying status or counts.

**Features:**
- 5 variants with semantic colors
- 3 sizes
- Rounded pill design
- Custom className support

**Usage:**
```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">Active</Badge>
<Badge variant="danger" size="sm">3</Badge>
<Badge variant="info">New</Badge>
```

**Props:**
- `variant?: "default" | "success" | "warning" | "danger" | "info"` (default: "default")
- `size?: "sm" | "md" | "lg"` (default: "md")
- All standard span HTML attributes

---

## Import Methods

### Individual Imports
```tsx
import Button from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
```

### Barrel Imports (Recommended)
```tsx
import { Button, Card, CardHeader, Input, Modal, Progress, Badge } from "@/components/ui";
```

## Styling

All components use Tailwind CSS 4 and support custom styling through the `className` prop:

```tsx
<Button className="w-full mt-4">
  Full Width Button
</Button>

<Card className="shadow-lg border-2">
  Custom Card Styling
</Card>
```

## Accessibility

All components follow accessibility best practices:
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader support
- Semantic HTML elements

## TypeScript

All components are fully typed with exported TypeScript interfaces:

```tsx
import type { ButtonProps, ModalProps, InputProps } from "@/components/ui";
```

## Client vs Server Components

Components that require interactivity use the `"use client"` directive:
- **Client Components**: Button, Input, Modal
- **Server Components**: Card, Progress, Badge

This allows for optimal performance with React Server Components in Next.js 16.
