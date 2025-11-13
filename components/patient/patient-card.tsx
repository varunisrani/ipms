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
      className="group block rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {patient.id}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Patient ID
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>Files</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {patient.totalFiles}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>Dates</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {dateCount}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <HardDrive className="h-4 w-4" />
            <span>Storage</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatSize(patient.totalSize)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
            <Clock className="h-4 w-4" />
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
