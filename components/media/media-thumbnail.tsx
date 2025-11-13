'use client';

import { useState } from 'react';
import { FileImage, FileText, Download, Trash2 } from 'lucide-react';
import type { FileMetadata } from '@/lib/types';

interface MediaThumbnailProps {
  file: FileMetadata;
  onPreview: (file: FileMetadata) => void;
  onDownload?: (file: FileMetadata) => void;
  onDelete?: (file: FileMetadata) => void;
  showActions?: boolean;
}

/**
 * Individual file thumbnail/card component
 * Displays image preview or PDF icon, file name, and size
 */
export function MediaThumbnail({
  file,
  onPreview,
  onDownload,
  onDelete,
  showActions = true,
}: MediaThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const isPdf = file.mimeType === 'application/pdf';
  const isImage = file.mimeType.startsWith('image/');

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="group relative rounded-lg border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      {/* Thumbnail/Preview */}
      <button
        onClick={() => onPreview(file)}
        className="w-full overflow-hidden rounded-t-lg bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="aspect-square flex items-center justify-center">
          {isPdf ? (
            <div className="flex flex-col items-center gap-2 p-6">
              <FileText className="h-16 w-16 text-red-500" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                PDF Document
              </span>
            </div>
          ) : isImage && !imageError ? (
            <img
              src={file.base64Data}
              alt={file.storedName}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6">
              <FileImage className="h-16 w-16 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Image
              </span>
            </div>
          )}
        </div>
      </button>

      {/* File Info */}
      <div className="p-3">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50" title={file.storedName}>
          {file.storedName}
        </p>
        <div className="mt-1 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
          <span>{formatSize(file.size)}</span>
          <span className="truncate ml-2" title={file.mimeType}>
            {file.fileType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex border-t border-zinc-200 dark:border-zinc-800">
          {onDownload && (
            <button
              onClick={() => onDownload(file)}
              className="flex flex-1 items-center justify-center gap-2 p-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              title="Download file"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(file)}
              className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-200 p-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-zinc-800 dark:text-red-400 dark:hover:bg-red-950/50"
              title="Delete file"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
