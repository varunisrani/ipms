"use client";

import { useState, useEffect } from "react";
import { X, FileImage, FileText, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/button";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  type: "image" | "pdf" | "other";
}

export default function FilePreview({
  files,
  onRemove,
  disabled = false,
}: FilePreviewProps) {
  const [filesWithPreviews, setFilesWithPreviews] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    // Generate previews for image files
    const previews: FileWithPreview[] = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      return {
        file,
        preview: isImage ? URL.createObjectURL(file) : undefined,
        type: isImage ? "image" : isPdf ? "pdf" : "other",
      };
    });

    setFilesWithPreviews(previews);

    // Cleanup previews on unmount
    return () => {
      previews.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Selected Files ({files.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filesWithPreviews.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white p-1 shadow-md hover:bg-red-50"
              aria-label={`Remove ${item.file.name}`}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>

            {/* File preview/icon */}
            <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              {item.type === "image" && item.preview ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="h-full w-full object-cover"
                />
              ) : item.type === "pdf" ? (
                <FileText className="h-16 w-16 text-red-600" />
              ) : (
                <FileImage className="h-16 w-16 text-gray-400" />
              )}
            </div>

            {/* File info */}
            <div className="space-y-1">
              <p
                className="truncate text-sm font-medium text-gray-900"
                title={item.file.name}
              >
                {item.file.name}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(item.file.size)}</span>
                <span className="uppercase">{item.file.name.split(".").pop()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
