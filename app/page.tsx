'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Upload, HardDrive, Users, FileImage, ArrowRight, AlertCircle, Download } from 'lucide-react';
import { PatientList } from '@/components/patient/patient-list';
import { useStorageInfo } from '@/lib/hooks/use-storage-info';
import { initializeStorage } from '@/lib/storage/file-storage';
import { ExportDataButton } from '@/components/export/export-data-button';

export default function HomePage() {
  const { storageInfo, metadata, isLoading } = useStorageInfo();
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage();
  }, []);

  // Format bytes to readable size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Get storage warning level
  const getStorageWarning = () => {
    if (!storageInfo) return null;
    if (storageInfo.usagePercentage >= 95) {
      return { level: 'critical', message: 'Storage is almost full' };
    }
    if (storageInfo.usagePercentage >= 80) {
      return { level: 'warning', message: 'Storage is getting full' };
    }
    return null;
  };

  const storageWarning = getStorageWarning();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Patient Photo Management System - View and manage patient photos
        </p>
      </div>

      {/* Storage Warning */}
      {storageWarning && (
        <div
          className={`mb-6 rounded-lg border p-4 ${
            storageWarning.level === 'critical'
              ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50'
              : 'border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              className={`h-5 w-5 ${
                storageWarning.level === 'critical'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}
            />
            <div>
              <p
                className={`font-medium ${
                  storageWarning.level === 'critical'
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}
              >
                {storageWarning.message}
              </p>
              <p
                className={`text-sm ${
                  storageWarning.level === 'critical'
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {storageInfo && `${storageInfo.usagePercentage.toFixed(1)}% used`} - Consider
                deleting old files or clearing storage.
              </p>
            </div>
            <Link
              href="/storage"
              className="ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
            >
              Manage Storage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Patients</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : metadata?.totalPatients || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Files</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : metadata?.totalFiles || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
              <FileImage className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Storage Used</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {isLoading ? '-' : formatSize(metadata?.totalSize || 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <HardDrive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          {storageInfo && (
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full transition-all ${
                    storageInfo.usagePercentage >= 95
                      ? 'bg-red-600'
                      : storageInfo.usagePercentage >= 80
                      ? 'bg-yellow-600'
                      : 'bg-purple-600'
                  }`}
                  style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                {storageInfo.usagePercentage.toFixed(1)}% of {formatSize(storageInfo.limit)} used
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/upload"
          className="group rounded-lg border border-zinc-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:from-blue-950/50 dark:to-blue-900/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Quick Action
              </p>
              <p className="mt-2 text-xl font-bold text-blue-900 dark:text-blue-50">
                Upload Files
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Add new patient photos
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white transition-transform group-hover:scale-110">
              <Upload className="h-6 w-6" />
            </div>
          </div>
        </Link>

        <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm dark:border-zinc-800 dark:from-green-950/50 dark:to-green-900/50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Data Backup
              </p>
              <p className="mt-2 text-xl font-bold text-green-900 dark:text-green-50">
                Export All Data
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Download complete backup as JSON
              </p>
              <div className="mt-4">
                <ExportDataButton variant="outline" className="border-green-200 bg-white text-green-900 hover:bg-green-50 dark:border-green-800 dark:bg-green-950 dark:text-green-50 dark:hover:bg-green-900" />
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
              <Download className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Patient List Section */}
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Patients
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            />
            <Link
              href="/storage"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <HardDrive className="h-4 w-4" />
              Storage
            </Link>
          </div>
        </div>

        <PatientList searchQuery={searchQuery} />
      </div>
    </div>
  );
}
