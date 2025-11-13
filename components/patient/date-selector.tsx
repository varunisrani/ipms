'use client';

import { Calendar, FileImage } from 'lucide-react';
import type { DateGroup } from '@/lib/types';
import { formatDate, formatRelativeDate } from '@/lib/utils/date-utils';

interface DateSelectorProps {
  dates: Record<string, DateGroup>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

/**
 * Date selector component
 * Displays dates with file counts for a patient
 * Allows selecting a date to filter files
 */
export function DateSelector({ dates, selectedDate, onSelectDate }: DateSelectorProps) {
  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(dates).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (sortedDates.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <Calendar className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No dates with files available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Select Date ({sortedDates.length})
      </h3>
      <div className="space-y-2">
        {sortedDates.map((dateKey) => {
          const dateGroup = dates[dateKey];
          const fileCount = dateGroup.files.length;
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/50'
                  : 'border-zinc-200 bg-white hover:border-blue-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700 dark:hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-zinc-100 dark:bg-zinc-800'
                    }`}
                  >
                    <Calendar
                      className={`h-5 w-5 ${
                        isSelected
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isSelected
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-zinc-900 dark:text-zinc-50'
                      }`}
                    >
                      {formatDate(dateKey, 'MMM dd, yyyy')}
                    </p>
                    <p
                      className={`text-sm ${
                        isSelected
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-zinc-500 dark:text-zinc-500'
                      }`}
                    >
                      {formatRelativeDate(dateKey)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileImage
                    className={`h-4 w-4 ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-zinc-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isSelected
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {fileCount} {fileCount === 1 ? 'file' : 'files'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
