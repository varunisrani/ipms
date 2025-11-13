'use client';

import { useState } from 'react';
import { MediaThumbnail } from './media-thumbnail';
import { MediaViewer } from './media-viewer';
import type { FileMetadata } from '@/lib/types';
import { FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface MediaGridProps {
  files: FileMetadata[];
  onDownload?: (file: FileMetadata) => void;
  onDelete?: (file: FileMetadata) => void;
  showActions?: boolean;
}

/**
 * Media grid component
 * Displays files in a responsive grid with thumbnails
 */
export function MediaGrid({
  files,
  onDownload,
  onDelete,
  showActions = true,
}: MediaGridProps) {
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);

  const handlePreview = (file: FileMetadata) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleDownload = (file: FileMetadata) => {
    if (onDownload) {
      onDownload(file);
    }
  };

  const handleDelete = (file: FileMetadata) => {
    if (onDelete) {
      onDelete(file);
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <FileImage className="h-8 w-8 text-zinc-400" />
        </div>
        <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          No files found
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Select a date with files to view them here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => (
          <MediaThumbnail
            key={file.id}
            file={file}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
            showActions={showActions}
          />
        ))}
      </div>

      {/* Media Viewer Modal */}
      {previewFile && (
        <MediaViewer
          file={previewFile}
          onClose={handleClosePreview}
          onDownload={onDownload ? () => handleDownload(previewFile) : undefined}
          onDelete={onDelete ? () => {
            handleDelete(previewFile);
            handleClosePreview();
          } : undefined}
        />
      )}
    </>
  );
}
