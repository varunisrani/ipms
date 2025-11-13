'use client';

import { useState } from 'react';
import { User, Calendar, Image, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatBytes } from '@/lib/storage/storage-utils';
import type { Patient } from '@/lib/types/patient';

interface StorageStatsProps {
  patients: Patient[];
  onDeletePatient: (patientId: string) => void;
}

/**
 * Storage Stats Component
 * Displays detailed storage statistics by patient with delete options
 */
export function StorageStats({ patients, onDeletePatient }: StorageStatsProps) {
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  // Sort patients by storage usage (descending)
  const sortedPatients = [...patients].sort((a, b) => b.totalSize - a.totalSize);

  // Calculate total storage used by all patients
  const totalStorage = patients.reduce((sum, patient) => sum + patient.totalSize, 0);

  // Toggle patient expansion
  const togglePatient = (patientId: string) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Calculate percentage of total storage
  const getPercentage = (size: number) => {
    if (totalStorage === 0) return 0;
    return (size / totalStorage) * 100;
  };

  if (patients.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Storage by Patient
        </h3>
        <div className="flex flex-col items-center justify-center py-12">
          <User className="mb-3 h-12 w-12 text-zinc-400" />
          <p className="text-zinc-600 dark:text-zinc-400">No patient data stored</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            Upload photos to see storage statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Storage by Patient
        </h3>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedPatients.map((patient) => {
          const isExpanded = expandedPatient === patient.id;
          const percentage = getPercentage(patient.totalSize);
          const dateGroups = Object.values(patient.dates).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          return (
            <div
              key={patient.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50"
            >
              {/* Patient Header */}
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                onClick={() => togglePatient(patient.id)}
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        Patient {patient.id}
                      </p>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Image className="h-3.5 w-3.5" />
                        {patient.totalFiles} {patient.totalFiles === 1 ? 'file' : 'files'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {Object.keys(patient.dates).length} {Object.keys(patient.dates).length === 1 ? 'date' : 'dates'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatBytes(patient.totalSize)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                  {/* Date Groups */}
                  <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Files by Date
                    </h4>
                    {dateGroups.map((dateGroup) => (
                      <div
                        key={dateGroup.date}
                        className="flex items-center justify-between rounded-md bg-zinc-50 p-3 dark:bg-zinc-900/50"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-zinc-500" />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            {formatDate(dateGroup.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          <span>{dateGroup.files.length} files</span>
                          <span className="font-medium">
                            {formatBytes(
                              dateGroup.files.reduce((sum, file) => sum + file.size, 0)
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Patient Metadata */}
                  <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">Created</p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {formatDate(patient.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">Last Updated</p>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {formatDate(patient.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePatient(patient.id);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Patient Data
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
