'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorageInfo } from '../storage/local-storage';
import { getMetadata } from '../storage/file-storage';
import type { StorageInfo, StorageMetadata } from '../types';

/**
 * Custom hook for monitoring storage information
 * Provides real-time storage usage and metadata
 *
 * @param refreshInterval - Optional interval in ms to refresh data (default: 0 = no auto-refresh)
 * @returns Object containing storage info, metadata, and refresh function
 */
export function useStorageInfo(refreshInterval: number = 0) {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [metadata, setMetadata] = useState<StorageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch and update storage information
  const refresh = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const info = getStorageInfo();
      const meta = getMetadata();

      setStorageInfo(info);
      setMetadata(meta);
    } catch (err) {
      console.error('Error fetching storage info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch storage info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Set up interval if specified
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(refresh, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, refresh]);

  return {
    storageInfo,
    metadata,
    isLoading,
    error,
    refresh,
  };
}
