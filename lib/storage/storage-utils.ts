/**
 * Storage utility functions for localStorage management
 * Provides helpers for calculating storage size, formatting bytes, and checking storage availability
 */

/**
 * Calculate the size of data when stringified
 * @param data - Any data to calculate size for
 * @returns Size in bytes
 */
export function calculateStorageSize(data: any): number {
  try {
    const jsonString = JSON.stringify(data);
    // Each character in JavaScript strings is 2 bytes (UTF-16)
    return new Blob([jsonString]).size;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
}

/**
 * Format bytes into human-readable string
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid size';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Check if localStorage is available and accessible
 * @returns True if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('localStorage is not available:', error);
    return false;
  }
}

/**
 * Get the storage limit for localStorage
 * Different browsers have different limits, this attempts to detect it
 * @returns Estimated storage limit in bytes
 */
export function getStorageLimit(): number {
  // Most browsers have a 5-10MB limit for localStorage
  // Chrome/Edge: ~10MB
  // Firefox: ~10MB
  // Safari: ~5MB
  // We'll use a conservative estimate of 5MB as the default
  const DEFAULT_LIMIT = 5 * 1024 * 1024; // 5MB in bytes

  // Try to detect actual limit (optional enhancement)
  // For now, return the conservative default
  return DEFAULT_LIMIT;
}

/**
 * Get current localStorage usage
 * @returns Object with total size and per-key breakdown
 */
export function getLocalStorageUsage(): { total: number; keys: Record<string, number> } {
  let total = 0;
  const keys: Record<string, number> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = new Blob([value]).size;
          keys[key] = size;
          total += size;
        }
      }
    }
  } catch (error) {
    console.error('Error getting localStorage usage:', error);
  }

  return { total, keys };
}

/**
 * Check if there's enough space to store data
 * @param dataSize - Size of data to store in bytes
 * @param threshold - Safety threshold (default: 0.95 = 95%)
 * @returns True if there's enough space
 */
export function hasEnoughSpace(dataSize: number, threshold: number = 0.95): boolean {
  const limit = getStorageLimit();
  const { total } = getLocalStorageUsage();
  const availableSpace = limit - total;
  const requiredSpace = dataSize * (1 / threshold); // Account for threshold

  return availableSpace >= requiredSpace;
}

/**
 * Calculate storage usage percentage
 * @returns Usage percentage (0-100)
 */
export function getStorageUsagePercentage(): number {
  const limit = getStorageLimit();
  const { total } = getLocalStorageUsage();
  return Math.round((total / limit) * 100);
}
