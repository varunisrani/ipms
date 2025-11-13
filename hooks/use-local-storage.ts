"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing state synchronized with localStorage
 *
 * @template T - The type of the stored value
 * @param {string} key - The localStorage key to use
 * @param {T} initialValue - The initial value if no value exists in localStorage
 * @returns {[T, (value: T | ((prevValue: T) => T)) => void, () => void]} A tuple containing:
 *   - The current value
 *   - A setter function to update the value
 *   - A remove function to clear the value from localStorage
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 * // Update value
 * setTheme('dark');
 *
 * // Remove from localStorage
 * removeTheme();
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void, () => void] {
  // Check if running on client side
  const isClient = typeof window !== "undefined";

  /**
   * Initialize state from localStorage or use initial value
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return initial value during SSR
    if (!isClient) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Update localStorage when state changes
   */
  useEffect(() => {
    if (!isClient) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, isClient]);

  /**
   * Setter function that updates both state and localStorage
   */
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Allow value to be a function for same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (error) {
        console.error(`Error updating localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Remove function that clears the value from localStorage and resets to initial value
   */
  const removeValue = useCallback(() => {
    try {
      if (isClient) {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isClient]);

  /**
   * Listen for storage changes from other tabs/windows
   */
  useEffect(() => {
    if (!isClient) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed
        setStoredValue(initialValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue, isClient]);

  return [storedValue, setValue, removeValue];
}
