'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Calendar as CalendarIcon, ListChecks } from 'lucide-react';
import { DateSelector } from '@/components/patient/date-selector';
import { MediaGrid } from '@/components/media/media-grid';
import { DownloadButton } from '@/components/media/download-button';
import { getPatient, deleteFile } from '@/lib/storage/file-storage';
import { formatDate, formatRelativeDate } from '@/lib/utils/date-utils';
import { base64ToBlob } from '@/lib/utils/file-utils';
import type { Patient, FileMetadata } from '@/lib/types';
import { toast } from 'sonner';

type Props = {
  params: Promise<{ id: string }>;
};

export default function PatientDetailPage({ params }: Props) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Load patient data
  useEffect(() => {
    try {
      setIsLoading(true);
      const patientData = getPatient(id);
      setPatient(patientData);

      // Auto-select the most recent date if available
      if (patientData && Object.keys(patientData.dates).length > 0) {
        const sortedDates = Object.keys(patientData.dates).sort((a, b) =>
          new Date(b).getTime() - new Date(a).getTime()
        );
        setSelectedDate(sortedDates[0]);
      }
    } catch (error) {
      console.error('Error loading patient:', error);
      toast.error('Failed to load patient data');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Handle file download
  const handleDownload = (file: FileMetadata) => {
    try {
      const blob = base64ToBlob(file.base64Data, file.mimeType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.storedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle file deletion
  const handleDelete = (file: FileMetadata) => {
    if (!confirm(`Are you sure you want to delete ${file.storedName}?`)) {
      return;
    }

    try {
      const success = deleteFile(id, file.id);
      if (success) {
        toast.success('File deleted successfully');
        // Reload patient data
        const updatedPatient = getPatient(id);
        setPatient(updatedPatient);

        // Clear selection if the date no longer has files
        if (selectedDate && updatedPatient && !updatedPatient.dates[selectedDate]) {
          setSelectedDate(null);
        }
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  // Toggle multi-select mode
  const toggleMultiSelectMode = () => {
    setMultiSelectMode(!multiSelectMode);
    setSelectedDates([]);
  };

  // Toggle date selection in multi-select mode
  const handleToggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  // Get files for selected dates in batch mode
  const getSelectedDatesFiles = () => {
    if (!patient) return [];
    const files: FileMetadata[] = [];
    selectedDates.forEach((date) => {
      if (patient.dates[date]) {
        files.push(...patient.dates[date].files);
      }
    });
    return files;
  };

  // Get files for selected date
  const selectedFiles =
    patient && selectedDate && patient.dates[selectedDate]
      ? patient.dates[selectedDate].files
      : [];

  // Get all files for patient (for download all)
  const allFiles = patient
    ? Object.values(patient.dates).flatMap((dateGroup) => dateGroup.files)
    : [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Loading patient data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Patient not found
          </p>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            No data found for patient ID: {id}
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Patient Details
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Patient ID: <span className="font-mono font-semibold">{patient.id}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Upload className="h-4 w-4" />
              Upload More
            </Link>
            {allFiles.length > 0 && (
              <DownloadButton
                files={allFiles}
                fileName={`patient_${patient.id}_all_files`}
                variant="multiple"
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Files</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {patient.totalFiles}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Storage Used</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {formatSize(patient.totalSize)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Last Updated</p>
          <p className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {formatRelativeDate(patient.updatedAt)}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
            {formatDate(patient.updatedAt, 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Date Selector */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <button
              onClick={toggleMultiSelectMode}
              className={`w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                multiSelectMode
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              <ListChecks className="h-4 w-4" />
              {multiSelectMode ? 'Exit Batch Mode' : 'Batch Download'}
            </button>
          </div>

          {multiSelectMode && selectedDates.length > 0 && (
            <div className="mb-4">
              <DownloadButton
                files={getSelectedDatesFiles()}
                fileName={`patient_${patient.id}_batch_${selectedDates.length}_dates`}
                variant="multiple"
                className="w-full justify-center"
              />
              <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-500">
                {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          <DateSelector
            dates={patient.dates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            multiSelect={multiSelectMode}
            selectedDates={selectedDates}
            onToggleDate={handleToggleDate}
          />
        </div>

        {/* Media Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-zinc-500" />
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {multiSelectMode
                  ? selectedDates.length > 0
                    ? `${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''} selected`
                    : 'Select dates for batch download'
                  : selectedDate
                  ? formatDate(selectedDate, 'MMMM dd, yyyy')
                  : 'Select a date to view files'}
              </h2>
            </div>
            {!multiSelectMode && selectedFiles.length > 0 && (
              <DownloadButton
                files={selectedFiles}
                fileName={`patient_${patient.id}_${selectedDate}`}
                variant="multiple"
              />
            )}
          </div>
          {multiSelectMode ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
              <ListChecks className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Batch Download Mode
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Select multiple dates from the left sidebar to download all files from those dates at once.
              </p>
            </div>
          ) : (
            <MediaGrid
              files={selectedFiles}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
