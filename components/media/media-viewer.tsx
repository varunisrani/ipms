'use client';

import { useEffect, useState } from 'react';
import { X, Download, Trash2, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import type { FileMetadata } from '@/lib/types';
import { formatDate } from '@/lib/utils/date-utils';

interface MediaViewerProps {
  file: FileMetadata;
  onClose: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

/**
 * Full-screen modal for file preview
 * Shows image preview or PDF info with file details
 */
export function MediaViewer({ file, onClose, onDownload, onDelete }: MediaViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(100);
  const isPdf = file.mimeType === 'application/pdf';
  const isImage = file.mimeType.startsWith('image/');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-black/50 p-4 backdrop-blur-sm">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">
            {file.storedName}
          </h3>
          <p className="text-sm text-zinc-300">
            {formatSize(file.size)} • {file.fileType.toUpperCase()} • {formatDate(file.uploadedAt, 'MMM dd, yyyy HH:mm')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {isImage && !isPdf && (
            <>
              <button
                onClick={handleZoomOut}
                className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                title="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                title="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <span className="text-sm text-white px-2">
                {zoom}%
              </span>
            </>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex h-full w-full items-center justify-center p-20"
        onClick={onClose}
      >
        <div
          className="max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {isPdf ? (
            <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-12 dark:bg-zinc-900">
              <FileText className="h-24 w-24 text-red-500" />
              <div className="text-center">
                <h3 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  PDF Document
                </h3>
                <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                  {file.storedName}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  PDF preview is not available in browser.
                  <br />
                  Download the file to view it.
                </p>
              </div>
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </button>
              )}
            </div>
          ) : isImage && !imageError ? (
            <img
              src={file.base64Data}
              alt={file.storedName}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              style={{ transform: `scale(${zoom / 100})` }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-12 dark:bg-zinc-900">
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Unable to load image
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The image data may be corrupted or in an unsupported format.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 text-sm text-white md:grid-cols-4">
            <div>
              <p className="text-zinc-400">Patient ID</p>
              <p className="font-mono font-semibold">{file.patientId}</p>
            </div>
            <div>
              <p className="text-zinc-400">Date</p>
              <p className="font-semibold">{formatDate(file.date, 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-zinc-400">Sequence</p>
              <p className="font-semibold">#{file.sequence.toString().padStart(3, '0')}</p>
            </div>
            <div>
              <p className="text-zinc-400">MIME Type</p>
              <p className="font-semibold">{file.mimeType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
