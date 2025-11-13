'use client';

import { useEffect, useState } from 'react';
import { Metadata } from 'next';
import {
  HardDrive,
  Users,
  Image,
  Database,
  RefreshCw,
  Download,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useStorageInfo, dispatchStorageUpdate } from '@/hooks/use-storage-info';
import { StorageMeter } from '@/components/storage/storage-meter';
import { StorageStats } from '@/components/storage/storage-stats';
import { CleanupTools } from '@/components/storage/cleanup-tools';
import { ExportDataButton } from '@/components/export/export-data-button';
import { formatBytes, clearAllStorage } from '@/lib/storage/storage-utils';
import { getAllPatients, deletePatient, getMetadata } from '@/lib/storage/file-storage';
import type { Patient } from '@/lib/types/patient';

/**
 * Storage Management Page
 * Monitor and manage storage usage for patient photos
 */
export default function StoragePage() {
  const storageInfo = useStorageInfo();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageMetadata, setStorageMetadata] = useState<{
    totalPatients: number;
    totalFiles: number;
    totalSize: number;
    lastUpdated: string;
  } | null>(null);

  // Load patients and metadata
  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedPatients = getAllPatients();
      const metadata = getMetadata();
      setPatients(loadedPatients);
      setStorageMetadata(metadata);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load storage data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    await storageInfo.refresh();
    loadData();
    toast.success('Storage information refreshed');
  };

  // Handle delete patient
  const handleDeletePatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Show confirmation toast
    toast(
      <div>
        <p className="font-medium">Delete patient {patientId}?</p>
        <p className="text-sm text-zinc-600">
          This will delete {patient.totalFiles} files ({formatBytes(patient.totalSize)})
        </p>
      </div>,
      {
        duration: 5000,
        action: {
          label: 'Delete',
          onClick: () => {
            const success = deletePatient(patientId);
            if (success) {
              loadData();
              dispatchStorageUpdate();
              toast.success(`Patient ${patientId} deleted`);
            } else {
              toast.error('Failed to delete patient');
            }
          },
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {},
        },
      }
    );
  };

  // Handle clear all data
  const handleClearAll = () => {
    const success = clearAllStorage();
    if (success) {
      loadData();
      dispatchStorageUpdate();
    } else {
      toast.error('Failed to clear data');
    }
  };

  // Handle import
  const handleImport = () => {
    loadData();
    dispatchStorageUpdate();
  };

  // Calculate localStorage-specific usage
  const localStorageSize = storageMetadata?.totalSize || 0;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Storage Management
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Monitor and manage your patient photo storage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={storageInfo.isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            <RefreshCw
              className={`h-4 w-4 ${storageInfo.isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <ExportDataButton variant="outline" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Patients</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : storageMetadata?.totalPatients || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Files */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Files</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : storageMetadata?.totalFiles || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Image className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Data Size */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Data Size</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : formatBytes(localStorageSize)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Storage Used */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Storage Used</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {storageInfo.isAvailable ? `${storageInfo.percentage.toFixed(1)}%` : '-'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Meter */}
      <div className="mb-6">
        <StorageMeter
          used={storageInfo.used}
          total={storageInfo.total}
          percentage={storageInfo.percentage}
          isAvailable={storageInfo.isAvailable}
          error={storageInfo.error}
        />
      </div>

      {/* Browser Storage Info */}
      {storageInfo.isAvailable && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <HardDrive className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-50">
                Browser Storage Information
              </p>
              <p className="mt-1 text-blue-700 dark:text-blue-400">
                Your browser reports <strong>{formatBytes(storageInfo.used)}</strong> used
                out of <strong>{formatBytes(storageInfo.total)}</strong> total storage
                quota. Patient data uses approximately{' '}
                <strong>{formatBytes(localStorageSize)}</strong> in localStorage.
              </p>
              {storageMetadata?.lastUpdated && (
                <p className="mt-1 text-blue-600 dark:text-blue-500">
                  Last updated: {formatDate(storageMetadata.lastUpdated)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warning if storage API not available */}
      {!storageInfo.isAvailable && (
        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-orange-900 dark:text-orange-50">
                Storage API Unavailable
              </p>
              <p className="mt-1 text-orange-700 dark:text-orange-400">
                {storageInfo.error ||
                  'Your browser does not support the Storage API. Storage information may be limited.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient Statistics */}
        <div>
          <StorageStats patients={patients} onDeletePatient={handleDeletePatient} />
        </div>

        {/* Cleanup Tools */}
        <div>
          <CleanupTools onClearAll={handleClearAll} onImport={handleImport} />

          {/* Storage Tips */}
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Storage Tips
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <Download className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                <span>
                  Regularly export your data to keep backups of patient photos
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HardDrive className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <span>
                  Browser storage has a limit of 5-10MB depending on your browser
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                <span>
                  Delete old patient data when no longer needed to free up space
                </span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                <span>
                  Import previously exported backups to restore patient data
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
