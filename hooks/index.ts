/**
 * Custom React Hooks for Patient Photo Management System
 *
 * This module exports all custom hooks used throughout the application.
 */

// Local Storage Hook
export { useLocalStorage } from "./use-local-storage";

// Storage Information Hook
export {
  useStorageInfo,
  dispatchStorageUpdate,
  formatBytes,
  type StorageInfo,
  type UseStorageInfoReturn,
} from "./use-storage-info";

// File Upload Hook
export {
  useFileUpload,
  type FileUploadProgress,
  type UploadOptions,
  type UseFileUploadReturn,
} from "./use-file-upload";

// Media Query Hooks
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useIsXLDesktop,
  useIsLandscape,
  useIsPortrait,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  useIsTouchDevice,
} from "./use-media-query";

// Responsive State Management Hooks
export {
  useResponsive,
  useResponsiveValue,
  useIsMobileDevice,
  useWindowSize,
  type Breakpoint,
  type ScreenSize,
  type ResponsiveState,
} from "./use-responsive";
