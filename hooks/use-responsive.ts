"use client";

import { useEffect, useState } from "react";
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLandscape,
  useIsTouchDevice,
} from "./use-media-query";

/**
 * Breakpoint type definition
 */
export type Breakpoint = "mobile" | "tablet" | "desktop" | "largeDesktop";

/**
 * Screen size information
 */
export interface ScreenSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
}

/**
 * Responsive state with comprehensive device information
 */
export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  isTouchDevice: boolean;
  breakpoint: Breakpoint;
  screenSize: ScreenSize;
}

/**
 * Hook for comprehensive responsive state management
 * Provides all information needed for responsive layouts
 */
export function useResponsive(): ResponsiveState {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLandscape = useIsLandscape();
  const isTouchDevice = useIsTouchDevice();

  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
    breakpoint: "desktop",
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let breakpoint: Breakpoint = "desktop";
      if (width < 640) {
        breakpoint = "mobile";
      } else if (width < 1024) {
        breakpoint = "tablet";
      } else if (width < 1280) {
        breakpoint = "desktop";
      } else {
        breakpoint = "largeDesktop";
      }

      setScreenSize({ width, height, breakpoint });
    };

    // Initial update
    updateScreenSize();

    // Update on resize with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const breakpoint: Breakpoint = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : "desktop";

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait: !isLandscape,
    isTouchDevice,
    breakpoint,
    screenSize,
  };
}

/**
 * Hook to get responsive value based on current breakpoint
 * @param values - Object with values for each breakpoint
 * @returns Value for current breakpoint
 */
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop: T;
}): T {
  const { breakpoint } = useResponsive();

  if (breakpoint === "mobile" && values.mobile !== undefined) {
    return values.mobile;
  }
  if (
    (breakpoint === "tablet" || breakpoint === "mobile") &&
    values.tablet !== undefined
  ) {
    return values.tablet;
  }
  return values.desktop;
}

/**
 * Hook to determine if current device is mobile-sized (for better ergonomics)
 * This is useful for showing mobile-optimized UI elements
 */
export function useIsMobileDevice(): boolean {
  const { isMobile, isTablet, isPortrait } = useResponsive();
  return isMobile || (isTablet && isPortrait);
}

/**
 * Hook for safe window dimensions (handles SSR)
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
