'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportData } from '@/lib/storage/file-storage';

interface ExportDataButtonProps {
  variant?: 'default' | 'outline';
  className?: string;
}

/**
 * Export Data Button Component
 * Exports all localStorage data as a JSON file with timestamp
 */
export function ExportDataButton({
  variant = 'default',
  className = ''
}: ExportDataButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      // Get all data from localStorage
      const jsonData = exportData();

      if (!jsonData) {
        toast.error('No data to export');
        return;
      }

      // Create a blob from the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `ipms-backup-${timestamp}.json`;

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const baseClasses = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = variant === 'outline'
    ? 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900'
    : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700';

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export All Data
        </>
      )}
    </button>
  );
}
