'use client';

import Link from 'next/link';
import { Users, Calendar, HardDrive, Clock } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils/date-utils';

interface PatientCardProps {
  patient: Patient;
}

/**
 * Individual patient card component
 * Displays patient ID, file count, storage used, and last updated date
 */
export function PatientCard({ patient }: PatientCardProps) {
  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Count total dates
  const dateCount = Object.keys(patient.dates).length;

  return (
    <Link
      href={`/patient/${patient.id}`}
      className="group block bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-mono text-sm font-bold text-zinc-900 dark:text-white truncate">
              {patient.id}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Patient ID
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Files</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {patient.totalFiles}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Dates</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {dateCount}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <HardDrive className="h-4 w-4 flex-shrink-0" />
            <span>Storage</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {formatSize(patient.totalSize)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-zinc-800 mt-2">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Updated</span>
          </div>
          <span className="text-zinc-600 dark:text-zinc-400">
            {formatRelativeDate(patient.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
