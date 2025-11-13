'use client';

import { useState } from 'react';
import { Trash2, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { importData } from '@/lib/storage/file-storage';
import { dispatchStorageUpdate } from '@/hooks/use-storage-info';

interface CleanupToolsProps {
  onClearAll: () => void;
  onImport: () => void;
}

/**
 * Confirmation Dialog Component
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDestructive = false,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-start gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isDestructive
                ? 'bg-red-100 dark:bg-red-900/20'
                : 'bg-blue-100 dark:bg-blue-900/20'
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${
                isDestructive
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cleanup Tools Component
 * Provides tools for clearing data and importing backups
 */
export function CleanupTools({ onClearAll, onImport }: CleanupToolsProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Handle clear all data
  const handleClearAll = () => {
    setShowClearDialog(true);
  };

  const confirmClearAll = () => {
    try {
      onClearAll();
      setShowClearDialog(false);
      toast.success('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  // Handle import data from JSON file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value to allow re-importing the same file
    event.target.value = '';

    // Check file type
    if (!file.name.endsWith('.json')) {
      toast.error('Please select a valid JSON file');
      return;
    }

    setIsImporting(true);

    try {
      const text = await file.text();
      const success = importData(text);

      if (success) {
        toast.success('Data imported successfully');
        // Trigger storage update event
        dispatchStorageUpdate();
        onImport();
      } else {
        toast.error('Failed to import data. Please check the file format.');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Invalid file format.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Data Management Tools
        </h3>

        <div className="space-y-3">
          {/* Import Data */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                  Import Backup
                </h4>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Restore data from a JSON backup file
                </p>
              </div>
            </div>
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
              />
              <span className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Choose File to Import
                  </>
                )}
              </span>
            </label>
          </div>

          {/* Clear All Data */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="mb-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-50">
                  Clear All Data
                </h4>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  Permanently delete all patient photos and data. This action cannot be
                  undone.
                </p>
              </div>
            </div>
            <button
              onClick={handleClearAll}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </button>
          </div>

          {/* Warning Notice */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              <div className="text-sm text-orange-700 dark:text-orange-400">
                <p className="font-medium">Important</p>
                <p className="mt-1">
                  Always export your data before clearing or importing to ensure you have
                  a backup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear All Data?"
        message="This will permanently delete all patient photos and data. This action cannot be undone. Are you sure you want to continue?"
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearDialog(false)}
        isDestructive
      />
    </>
  );
}
