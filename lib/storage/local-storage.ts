/**
 * LocalStorage wrapper with error handling and type safety
 * Provides a safe interface for interacting with browser's localStorage
 */

import type { StorageInfo } from '../types';
import {
  isStorageAvailable,
  getStorageLimit,
  getLocalStorageUsage,
  getStorageUsagePercentage,
} from './storage-utils';

/**
 * Get an item from localStorage with type safety
 * @param key - The storage key
 * @returns Parsed data or null if not found/error
 */
export function getItem<T>(key: string): T | null {
  try {
    if (!isStorageAvailable()) {
      console.error('localStorage is not available');
      return null;
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Set an item in localStorage
 * @param key - The storage key
 * @param value - The value to store (will be JSON stringified)
 * @returns True if successful, false otherwise
 */
export function setItem(key: string, value: any): boolean {
  try {
    if (!isStorageAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Check if it's a QuotaExceededError
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Please free up space.');
    } else {
      console.error(`Error setting item "${key}" in localStorage:`, error);
    }
    return false;
  }
}

/**
 * Remove an item from localStorage
 * @param key - The storage key
 * @returns True if successful, false otherwise
 */
export function removeItem(key: string): boolean {
  try {
    if (!isStorageAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item "${key}" from localStorage:`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns True if successful, false otherwise
 */
export function clear(): boolean {
  try {
    if (!isStorageAvailable()) {
      console.error('localStorage is not available');
      return false;
    }

    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get storage information including usage and limits
 * @returns StorageInfo object with usage details
 */
export function getStorageInfo(): StorageInfo {
  const limit = getStorageLimit();
  const { total } = getLocalStorageUsage();
  const available = Math.max(0, limit - total);
  const usagePercentage = getStorageUsagePercentage();

  return {
    used: total,
    available,
    limit,
    usagePercentage,
  };
}

/**
 * Check if a key exists in localStorage
 * @param key - The storage key
 * @returns True if key exists
 */
export function hasKey(key: string): boolean {
  try {
    if (!isStorageAvailable()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking key "${key}" in localStorage:`, error);
    return false;
  }
}

/**
 * Get all keys from localStorage
 * @returns Array of all keys
 */
export function getAllKeys(): string[] {
  try {
    if (!isStorageAvailable()) {
      return [];
    }

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting all keys from localStorage:', error);
    return [];
  }
}

/**
 * Get the size of a specific item in localStorage
 * @param key - The storage key
 * @returns Size in bytes, or 0 if not found
 */
export function getItemSize(key: string): number {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return 0;
    }
    return new Blob([item]).size;
  } catch (error) {
    console.error(`Error getting size of item "${key}":`, error);
    return 0;
  }
}
