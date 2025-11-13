/**
 * Touch Utilities for mobile and tablet interactions
 * Provides gesture detection and touch-optimized event handlers
 */

export interface TouchPosition {
  x: number;
  y: number;
}

export interface SwipeEvent {
  direction: "left" | "right" | "up" | "down";
  distance: number;
  duration: number;
  velocity: number;
}

export interface TouchConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScroll?: boolean;
}

/**
 * Default configuration for touch gestures
 */
const DEFAULT_CONFIG: Required<TouchConfig> = {
  minSwipeDistance: 50, // Minimum distance in pixels for a swipe
  maxSwipeTime: 300, // Maximum time in ms for a swipe
  preventScroll: false,
};

/**
 * Class to handle touch gestures
 */
export class TouchGestureHandler {
  private startPos: TouchPosition | null = null;
  private startTime: number = 0;
  private config: Required<TouchConfig>;

  constructor(config: TouchConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Handle touch start event
   */
  onTouchStart = (e: TouchEvent | React.TouchEvent): void => {
    const touch = "touches" in e ? e.touches[0] : e;
    this.startPos = {
      x: touch.clientX,
      y: touch.clientY,
    };
    this.startTime = Date.now();

    if (this.config.preventScroll && e.cancelable) {
      e.preventDefault();
    }
  };

  /**
   * Handle touch end event and detect swipe
   */
  onTouchEnd = (
    e: TouchEvent | React.TouchEvent,
    callback?: (swipe: SwipeEvent) => void
  ): void => {
    if (!this.startPos) return;

    const touch = "changedTouches" in e ? e.changedTouches[0] : e;
    const endPos: TouchPosition = {
      x: touch.clientX,
      y: touch.clientY,
    };
    const endTime = Date.now();

    const swipe = this.detectSwipe(endPos, endTime);
    if (swipe && callback) {
      callback(swipe);
    }

    // Reset
    this.startPos = null;
    this.startTime = 0;
  };

  /**
   * Detect swipe gesture from touch positions
   */
  private detectSwipe(
    endPos: TouchPosition,
    endTime: number
  ): SwipeEvent | null {
    if (!this.startPos) return null;

    const deltaX = endPos.x - this.startPos.x;
    const deltaY = endPos.y - this.startPos.y;
    const duration = endTime - this.startTime;

    // Check if swipe is within time limit
    if (duration > this.config.maxSwipeTime) return null;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const distance = Math.sqrt(absX * absX + absY * absY);

    // Check if swipe distance meets minimum
    if (distance < this.config.minSwipeDistance) return null;

    // Determine direction (prioritize the axis with more movement)
    let direction: SwipeEvent["direction"];
    if (absX > absY) {
      direction = deltaX > 0 ? "right" : "left";
    } else {
      direction = deltaY > 0 ? "down" : "up";
    }

    const velocity = distance / duration; // pixels per millisecond

    return {
      direction,
      distance,
      duration,
      velocity,
    };
  }
}

/**
 * React hook for swipe detection
 */
export function useSwipeGesture(
  onSwipe: (swipe: SwipeEvent) => void,
  config: TouchConfig = {}
) {
  const handler = new TouchGestureHandler(config);

  return {
    onTouchStart: handler.onTouchStart,
    onTouchEnd: (e: React.TouchEvent) => handler.onTouchEnd(e, onSwipe),
  };
}

/**
 * Detect if touch event is a long press
 */
export function detectLongPress(
  callback: () => void,
  duration: number = 500
): {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
} {
  let timeoutId: NodeJS.Timeout | null = null;
  let moved = false;

  return {
    onTouchStart: () => {
      moved = false;
      timeoutId = setTimeout(() => {
        if (!moved) {
          callback();
        }
      }, duration);
    },
    onTouchMove: () => {
      moved = true;
      if (timeoutId) clearTimeout(timeoutId);
    },
    onTouchEnd: () => {
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}

/**
 * Get touch-friendly size class (minimum 44px for accessibility)
 */
export function getTouchTargetSize(size: "sm" | "md" | "lg" = "md"): string {
  const sizes = {
    sm: "min-h-11 min-w-11", // 44px minimum
    md: "min-h-12 min-w-12", // 48px
    lg: "min-h-14 min-w-14", // 56px
  };
  return sizes[size];
}

/**
 * Prevent pull-to-refresh on mobile
 */
export function preventPullToRefresh(element: HTMLElement): () => void {
  let startY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].pageY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].pageY;
    // Prevent pull-to-refresh when scrolled to top and pulling down
    if (element.scrollTop === 0 && currentY > startY && e.cancelable) {
      e.preventDefault();
    }
  };

  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchmove", handleTouchMove, { passive: false });

  // Return cleanup function
  return () => {
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
  };
}

/**
 * Enable smooth kinetic scrolling for touch devices
 */
export function enableKineticScrolling(element: HTMLElement): string {
  return "-webkit-overflow-scrolling: touch; overscroll-behavior: contain;";
}

/**
 * Haptic feedback for touch interactions (if supported)
 */
export function triggerHapticFeedback(
  type: "light" | "medium" | "heavy" = "light"
): void {
  if ("vibrate" in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
}

/**
 * Check if device supports hover (non-touch devices)
 */
export function supportsHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Get optimal spacing for touch targets based on device
 */
export function getTouchSpacing(density: "comfortable" | "compact" = "comfortable"): string {
  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  if (density === "comfortable") {
    return isMobile ? "gap-4" : "gap-3";
  }
  return isMobile ? "gap-3" : "gap-2";
}

/**
 * Add momentum scrolling styles
 */
export const momentumScrollStyles = {
  WebkitOverflowScrolling: "touch",
  overscrollBehavior: "contain",
} as const;

/**
 * Touch-optimized scroll handler with momentum
 */
export function createTouchScroll(container: HTMLElement) {
  let isScrolling = false;
  let startY = 0;
  let startTime = 0;
  let velocityY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    isScrolling = true;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    velocityY = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isScrolling) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const deltaTime = Date.now() - startTime;

    if (deltaTime > 0) {
      velocityY = deltaY / deltaTime;
    }

    container.scrollTop += deltaY;
    startY = currentY;
    startTime = Date.now();
  };

  const handleTouchEnd = () => {
    if (!isScrolling) return;
    isScrolling = false;

    // Apply momentum
    if (Math.abs(velocityY) > 0.5) {
      const momentum = velocityY * 100; // Adjust multiplier for desired effect
      container.scrollTop += momentum;
    }
  };

  container.addEventListener("touchstart", handleTouchStart, { passive: true });
  container.addEventListener("touchmove", handleTouchMove, { passive: true });
  container.addEventListener("touchend", handleTouchEnd, { passive: true });

  return () => {
    container.removeEventListener("touchstart", handleTouchStart);
    container.removeEventListener("touchmove", handleTouchMove);
    container.removeEventListener("touchend", handleTouchEnd);
  };
}
