'use client';

import { HardDrive, AlertTriangle, AlertCircle } from 'lucide-react';

interface StorageMeterProps {
  used: number;
  total: number;
  percentage: number;
  isAvailable: boolean;
  error?: string;
}

/**
 * Storage Meter Component
 * Visual progress bar showing localStorage usage with color gradients
 * Shows warnings when storage is getting full
 */
export function StorageMeter({
  used,
  total,
  percentage,
  isAvailable,
  error
}: StorageMeterProps) {
  // Determine color based on usage percentage
  const getColorClasses = () => {
    if (percentage >= 95) {
      return {
        bg: 'bg-red-500',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        bgCard: 'bg-red-50 dark:bg-red-900/10'
      };
    } else if (percentage >= 80) {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        bgCard: 'bg-orange-50 dark:bg-orange-900/10'
      };
    } else if (percentage >= 60) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-800',
        bgCard: 'bg-yellow-50 dark:bg-yellow-900/10'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        bgCard: 'bg-green-50 dark:bg-green-900/10'
      };
    }
  };

  const colors = getColorClasses();

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Show warning message based on usage
  const getWarningMessage = () => {
    if (percentage >= 95) {
      return {
        icon: <AlertCircle className="h-5 w-5" />,
        message: 'Critical: Storage is nearly full! Delete data immediately to avoid issues.',
        show: true
      };
    } else if (percentage >= 80) {
      return {
        icon: <AlertTriangle className="h-5 w-5" />,
        message: 'Warning: Storage is getting full. Consider cleaning up old data.',
        show: true
      };
    }
    return { icon: null, message: '', show: false };
  };

  const warning = getWarningMessage();

  if (!isAvailable) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Storage information unavailable</p>
            {error && <p className="text-sm">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Storage Usage
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Browser local storage
            </p>
          </div>
        </div>
        <div className={`text-right ${colors.text}`}>
          <p className="text-3xl font-bold">{percentage.toFixed(1)}%</p>
          <p className="text-sm">
            {formatBytes(used)} / {formatBytes(total)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ease-out ${colors.bg}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning Message */}
      {warning.show && (
        <div className={`flex items-start gap-2 rounded-lg border p-3 ${colors.border} ${colors.bgCard}`}>
          <div className={colors.text}>
            {warning.icon}
          </div>
          <p className={`text-sm ${colors.text}`}>
            {warning.message}
          </p>
        </div>
      )}

      {/* Storage Info */}
      {!warning.show && (
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Available: {formatBytes(total - used)}</span>
          <span>Total: {formatBytes(total)}</span>
        </div>
      )}
    </div>
  );
}
