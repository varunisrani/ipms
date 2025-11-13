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

// File Upload Hook (Phase 2 structure)
export {
  useFileUpload,
  type FileUploadProgress,
  type UploadOptions,
  type UploadedFile,
  type UseFileUploadReturn,
} from "./use-file-upload";
