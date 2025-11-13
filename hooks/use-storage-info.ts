"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Storage information interface
 */
export interface StorageInfo {
  /** Total storage quota in bytes */
  total: number;
  /** Used storage in bytes */
  used: number;
  /** Available storage in bytes */
  available: number;
  /** Percentage of storage used (0-100) */
  percentage: number;
  /** Whether storage information is available */
  isAvailable: boolean;
  /** Error message if storage info couldn't be retrieved */
  error?: string;
}

/**
 * Return type for useStorageInfo hook
 */
export interface UseStorageInfoReturn extends StorageInfo {
  /** Function to manually refresh storage information */
  refresh: () => Promise<void>;
  /** Whether storage info is currently being refreshed */
  isRefreshing: boolean;
}

/**
 * Custom hook for getting browser storage information
 *
 * Provides information about the browser's storage quota, including
 * total available space, used space, and percentage used.
 *
 * @returns {UseStorageInfoReturn} Storage information and refresh function
 *
 * @example
 * ```tsx
 * const { used, total, percentage, refresh, isRefreshing } = useStorageInfo();
 *
 * console.log(`Using ${percentage}% of storage`);
 * console.log(`${used} / ${total} bytes`);
 *
 * // Manually refresh storage info
 * await refresh();
 * ```
 */
export function useStorageInfo(): UseStorageInfoReturn {
  const isClient = typeof window !== "undefined";

  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    total: 0,
    used: 0,
    available: 0,
    percentage: 0,
    isAvailable: false,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Calculate storage information from StorageEstimate
   */
  const calculateStorageInfo = useCallback(
    (estimate: StorageEstimate): StorageInfo => {
      const quota = estimate.quota || 0;
      const usage = estimate.usage || 0;
      const available = quota - usage;
      const percentage = quota > 0 ? Math.round((usage / quota) * 100 * 100) / 100 : 0;

      return {
        total: quota,
        used: usage,
        available,
        percentage,
        isAvailable: true,
      };
    },
    []
  );

  /**
   * Fetch storage information from the Storage API
   */
  const fetchStorageInfo = useCallback(async (): Promise<StorageInfo> => {
    // Return default values during SSR
    if (!isClient) {
      return {
        total: 0,
        used: 0,
        available: 0,
        percentage: 0,
        isAvailable: false,
      };
    }

    // Check if the Storage API is available
    if (!navigator.storage || !navigator.storage.estimate) {
      return {
        total: 0,
        used: 0,
        available: 0,
        percentage: 0,
        isAvailable: false,
        error: "Storage API not available in this browser",
      };
    }

    try {
      const estimate = await navigator.storage.estimate();
      return calculateStorageInfo(estimate);
    } catch (error) {
      console.error("Error fetching storage information:", error);
      return {
        total: 0,
        used: 0,
        available: 0,
        percentage: 0,
        isAvailable: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [isClient, calculateStorageInfo]);

  /**
   * Refresh storage information
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const info = await fetchStorageInfo();
      setStorageInfo(info);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchStorageInfo]);

  /**
   * Initial fetch and setup event listeners
   */
  useEffect(() => {
    if (!isClient) {
      return;
    }

    // Initial fetch
    refresh();

    /**
     * Listen for storage events from other tabs/windows
     * Note: storage event only fires for localStorage changes,
     * but we can use it as a trigger to refresh storage info
     */
    const handleStorageChange = () => {
      refresh();
    };

    window.addEventListener("storage", handleStorageChange);

    /**
     * Custom event for manual storage updates
     * Components can dispatch this event when they know storage has changed
     */
    const handleStorageUpdate = () => {
      refresh();
    };

    window.addEventListener("storageupdate", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storageupdate", handleStorageUpdate);
    };
  }, [isClient, refresh]);

  return {
    ...storageInfo,
    refresh,
    isRefreshing,
  };
}

/**
 * Utility function to dispatch a storage update event
 * Call this after making changes to storage to trigger a refresh in useStorageInfo
 *
 * @example
 * ```tsx
 * // After uploading files or modifying storage
 * dispatchStorageUpdate();
 * ```
 */
export function dispatchStorageUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storageupdate"));
  }
}

/**
 * Format bytes to human-readable string
 *
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted string (e.g., "1.5 MB")
 *
 * @example
 * ```tsx
 * formatBytes(1024); // "1 KB"
 * formatBytes(1536, 2); // "1.50 KB"
 * formatBytes(1048576); // "1 MB"
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
