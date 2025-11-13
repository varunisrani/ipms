'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FileMetadata } from '@/lib/types';
import { base64ToBlob } from '@/lib/utils/file-utils';
import { downloadZip } from '@/lib/utils/download-utils';

interface DownloadButtonProps {
  files: FileMetadata[];
  fileName?: string;
  variant?: 'single' | 'multiple';
  className?: string;
}

/**
 * Download button component with support for single file or ZIP download
 */
export function DownloadButton({
  files,
  fileName,
  variant = 'single',
  className = '',
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (files.length === 0) {
      toast.error('No files to download');
      return;
    }

    setIsDownloading(true);

    try {
      if (variant === 'single' && files.length === 1) {
        // Download single file
        const file = files[0];
        const blob = base64ToBlob(file.base64Data, file.mimeType);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || file.storedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('File downloaded successfully');
      } else {
        // Download multiple files as ZIP
        const zipFileName = fileName || `files_${new Date().toISOString().split('T')[0]}`;

        // Convert FileMetadata to the format expected by download-utils
        const filesForZip = files.map((file) => ({
          id: file.id,
          fileName: file.storedName,
          fileData: file.base64Data,
          mimeType: file.mimeType,
          fileSize: file.size,
          uploadDate: file.uploadedAt,
          patientId: file.patientId,
        }));

        await downloadZip(filesForZip, zipFileName);
        toast.success(`Downloaded ${files.length} files as ZIP`);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download files');
    } finally {
      setIsDownloading(false);
    }
  };

  const buttonText =
    variant === 'single' && files.length === 1
      ? 'Download'
      : `Download ${files.length} file${files.length !== 1 ? 's' : ''}`;

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || files.length === 0}
      className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {buttonText}
        </>
      )}
    </button>
  );
}
