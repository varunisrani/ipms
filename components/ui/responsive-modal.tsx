"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useResponsive } from "@/hooks/use-responsive";
import { useSwipeGesture } from "@/lib/utils/touch-utils";

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /**
   * Modal size on desktop (full-screen on mobile by default)
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Close modal when clicking overlay
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Footer content (buttons, actions, etc.)
   */
  footer?: ReactNode;
  /**
   * Force full-screen mode even on desktop
   * @default false
   */
  forceFullScreen?: boolean;
  /**
   * Enable swipe-down to close on mobile
   * @default true
   */
  swipeToClose?: boolean;
  /**
   * Custom header content (replaces title)
   */
  customHeader?: ReactNode;
}

/**
 * Responsive Modal Component
 * - Full-screen on mobile with slide-up animation
 * - Centered dialog on tablet/desktop
 * - Touch-optimized with swipe gestures
 * - Proper accessibility and focus management
 */
export default function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  forceFullScreen = false,
  swipeToClose = true,
  customHeader,
}: ResponsiveModalProps) {
  const { isMobile, isTablet } = useResponsive();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Swipe gesture for closing on mobile
  const swipeHandlers = useSwipeGesture(
    (swipe) => {
      if (swipe.direction === "down" && swipe.distance > 100) {
        onClose();
      }
    },
    { minSwipeDistance: 100 }
  );

  // Desktop size classes
  const sizeStyles = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-full",
  };

  const isFullScreen = isMobile || forceFullScreen;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <>
      {/* Backdrop - darker on mobile for better contrast */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isFullScreen
            ? "bg-black/60 backdrop-blur-sm"
            : "bg-black/40 backdrop-blur-sm"
        } ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-50 flex ${isFullScreen ? "items-end sm:items-center" : "items-center"} justify-center ${!isFullScreen && "p-4"}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`
            bg-white dark:bg-zinc-950
            ${
              isFullScreen
                ? "w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:w-auto"
                : "rounded-2xl max-h-[90vh]"
            }
            ${!isFullScreen && `w-full ${sizeStyles[size]}`}
            flex flex-col
            shadow-2xl
            transform transition-all duration-300 ease-out
            ${isOpen ? (isFullScreen ? "translate-y-0" : "scale-100 opacity-100") : (isFullScreen ? "translate-y-full" : "scale-95 opacity-0")}
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Swipe indicator on mobile */}
          {isFullScreen && swipeToClose && (
            <div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing sm:hidden"
              {...(swipeToClose ? swipeHandlers : {})}
            >
              <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>
          )}

          {/* Header */}
          {(customHeader || title || showCloseButton) && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              {customHeader || (
                <>
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto flex items-center justify-center h-11 w-11 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Content - scrollable area */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-4 sm:px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (typeof window === "undefined") return null;

  return createPortal(modalContent, document.body);
}

/**
 * Responsive Modal Actions
 * Pre-styled footer actions for common modal patterns
 */
export function ResponsiveModalActions({
  children,
  align = "end",
  className = "",
}: {
  children: ReactNode;
  align?: "start" | "center" | "end" | "between";
  className?: string;
}) {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={`flex flex-col-reverse sm:flex-row gap-3 ${alignClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Bottom Sheet Modal
 * Alternative presentation style that slides up from bottom
 */
export function ResponsiveBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "90vh",
  swipeToClose = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxHeight?: string;
  swipeToClose?: boolean;
}) {
  const swipeHandlers = useSwipeGesture(
    (swipe) => {
      if (swipe.direction === "down" && swipe.distance > 100) {
        onClose();
      }
    },
    { minSwipeDistance: 100 }
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle */}
        {swipeToClose && (
          <div
            className="flex justify-center py-4 cursor-grab active:cursor-grabbing"
            {...swipeHandlers}
          >
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 pb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div
          className="px-6 pb-6 overflow-y-auto"
          style={{
            WebkitOverflowScrolling: "touch",
            maxHeight: `calc(${maxHeight} - 6rem)`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
