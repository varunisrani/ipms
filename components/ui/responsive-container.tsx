"use client";

import { ReactNode } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Maximum width constraint
   * @default "7xl"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  /**
   * Padding size - automatically adjusts for mobile
   * @default "default"
   */
  padding?: "none" | "tight" | "default" | "loose";
  /**
   * Enable container queries
   * @default false
   */
  containerQuery?: boolean;
  /**
   * Center content horizontally
   * @default true
   */
  center?: boolean;
  /**
   * Apply full height on mobile
   * @default false
   */
  fullHeightMobile?: boolean;
  /**
   * Custom mobile padding override
   */
  mobilePadding?: string;
  /**
   * Custom tablet padding override
   */
  tabletPadding?: string;
  /**
   * Custom desktop padding override
   */
  desktopPadding?: string;
}

/**
 * Responsive Container Component
 * Provides consistent spacing and max-width constraints with mobile-first approach
 */
export default function ResponsiveContainer({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "default",
  containerQuery = false,
  center = true,
  fullHeightMobile = false,
  mobilePadding,
  tabletPadding,
  desktopPadding,
}: ResponsiveContainerProps) {
  const { isMobile, isTablet } = useResponsive();

  // Max width classes
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  // Padding classes - mobile-first approach
  const paddingClasses = {
    none: "px-0",
    tight: "px-3 sm:px-4 lg:px-6",
    default: "px-4 sm:px-6 lg:px-8",
    loose: "px-6 sm:px-8 lg:px-12",
  };

  // Custom padding based on device
  let customPadding = "";
  if (mobilePadding && isMobile) {
    customPadding = mobilePadding;
  } else if (tabletPadding && isTablet) {
    customPadding = tabletPadding;
  } else if (desktopPadding && !isMobile && !isTablet) {
    customPadding = desktopPadding;
  }

  const containerClasses = [
    // Base
    "w-full",
    // Max width
    center && maxWidthClasses[maxWidth],
    // Centering
    center && "mx-auto",
    // Padding
    customPadding || paddingClasses[padding],
    // Full height on mobile
    fullHeightMobile && "min-h-screen sm:min-h-0",
    // Container query
    containerQuery && "@container",
    // Custom classes
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClasses}>{children}</div>;
}

/**
 * Responsive Grid Container
 * Auto-adjusting grid layout based on screen size
 */
export function ResponsiveGrid({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "default",
  minItemWidth,
}: {
  children: ReactNode;
  className?: string;
  cols?: { mobile?: number; tablet?: number; desktop: number };
  gap?: "tight" | "default" | "loose";
  minItemWidth?: string;
}) {
  const gapClasses = {
    tight: "gap-3 sm:gap-4",
    default: "gap-4 sm:gap-6",
    loose: "gap-6 sm:gap-8",
  };

  // If minItemWidth is provided, use auto-fit grid
  if (minItemWidth) {
    return (
      <div
        className={`grid ${gapClasses[gap]} ${className}`}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
        }}
      >
        {children}
      </div>
    );
  }

  // Otherwise use responsive columns
  const mobileCols = cols.mobile || 1;
  const tabletCols = cols.tablet || 2;
  const desktopCols = cols.desktop;

  const gridColsClasses = `grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${desktopCols}`;

  return (
    <div className={`grid ${gridColsClasses} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Responsive Stack Container
 * Vertical stacking with consistent spacing
 */
export function ResponsiveStack({
  children,
  className = "",
  spacing = "default",
  dividers = false,
}: {
  children: ReactNode;
  className?: string;
  spacing?: "tight" | "default" | "loose";
  dividers?: boolean;
}) {
  const spacingClasses = {
    tight: "space-y-2 sm:space-y-3",
    default: "space-y-4 sm:space-y-6",
    loose: "space-y-6 sm:space-y-8",
  };

  const dividerClasses = dividers
    ? "divide-y divide-zinc-200 dark:divide-zinc-800"
    : "";

  return (
    <div
      className={`flex flex-col ${spacingClasses[spacing]} ${dividerClasses} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Section Container
 * Full-width section with inner container
 */
export function ResponsiveSection({
  children,
  className = "",
  containerClassName = "",
  maxWidth = "7xl",
  padding = "default",
  background = "transparent",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  maxWidth?: ResponsiveContainerProps["maxWidth"];
  padding?: ResponsiveContainerProps["padding"];
  background?: "transparent" | "primary" | "secondary" | "accent";
}) {
  const backgroundClasses = {
    transparent: "",
    primary: "bg-white dark:bg-zinc-950",
    secondary: "bg-zinc-50 dark:bg-zinc-900",
    accent: "bg-blue-50 dark:bg-blue-950/20",
  };

  return (
    <section className={`${backgroundClasses[background]} ${className}`}>
      <ResponsiveContainer
        maxWidth={maxWidth}
        padding={padding}
        className={containerClassName}
      >
        {children}
      </ResponsiveContainer>
    </section>
  );
}

/**
 * Responsive Flex Container
 * Flexible layout that adjusts direction based on screen size
 */
export function ResponsiveFlex({
  children,
  className = "",
  direction = "row",
  mobileDirection,
  align = "start",
  justify = "start",
  gap = "default",
  wrap = false,
}: {
  children: ReactNode;
  className?: string;
  direction?: "row" | "col";
  mobileDirection?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "tight" | "default" | "loose";
  wrap?: boolean;
}) {
  const directionClasses = mobileDirection
    ? `flex-${mobileDirection} sm:flex-${direction}`
    : `flex-${direction}`;

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const gapClasses = {
    tight: "gap-2 sm:gap-3",
    default: "gap-3 sm:gap-4",
    loose: "gap-4 sm:gap-6",
  };

  return (
    <div
      className={`flex ${directionClasses} ${alignClasses[align]} ${justifyClasses[justify]} ${gapClasses[gap]} ${wrap ? "flex-wrap" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Card Grid
 * Specialized grid for card layouts
 */
export function ResponsiveCardGrid({
  children,
  className = "",
  minCardWidth = "280px",
}: {
  children: ReactNode;
  className?: string;
  minCardWidth?: string;
}) {
  return (
    <div
      className={`grid gap-4 sm:gap-6 ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minCardWidth}, 100%), 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
