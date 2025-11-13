"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect media query matches
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false;
}

/**
 * Predefined breakpoint hooks for common screen sizes
 * Following Tailwind CSS 4 default breakpoints
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery("(min-width: 1280px)");
}

export function useIsXLDesktop(): boolean {
  return useMediaQuery("(min-width: 1536px)");
}

/**
 * Hook to detect if device is in landscape orientation
 */
export function useIsLandscape(): boolean {
  return useMediaQuery("(orientation: landscape)");
}

/**
 * Hook to detect if device is in portrait orientation
 */
export function useIsPortrait(): boolean {
  return useMediaQuery("(orientation: portrait)");
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Hook to detect if user prefers dark mode at system level
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

/**
 * Hook to detect touch-enabled devices
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}
