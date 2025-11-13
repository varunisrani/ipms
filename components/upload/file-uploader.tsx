"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, FileType, X } from "lucide-react";
import { validateFiles } from "@/lib/utils/validation";
import Button from "@/components/ui/button";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (errors: Array<{ file: File; error: string }>) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export default function FileUploader({
  onFilesSelected,
  onFilesRejected,
  disabled = false,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate files
      const { valid, invalid } = validateFiles(acceptedFiles, maxSize);

      // Handle valid files
      if (valid.length > 0) {
        onFilesSelected(valid);
      }

      // Handle invalid files
      if (invalid.length > 0 && onFilesRejected) {
        onFilesRejected(invalid);
      }
    },
    [onFilesSelected, onFilesRejected, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    disabled,
    maxFiles,
    maxSize,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const getDropzoneStyles = () => {
    if (disabled) {
      return "border-gray-300 bg-gray-100 cursor-not-allowed";
    }
    if (isDragReject) {
      return "border-red-500 bg-red-50";
    }
    if (isDragActive) {
      return "border-blue-500 bg-blue-50";
    }
    return "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer";
  };

  const getIconColor = () => {
    if (disabled) return "text-gray-400";
    if (isDragReject) return "text-red-500";
    if (isDragActive) return "text-blue-500";
    return "text-gray-400";
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative rounded-lg border-2 border-dashed p-8 transition-all duration-200
          ${getDropzoneStyles()}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          <div className={`mb-4 ${getIconColor()}`}>
            {isDragActive ? (
              <Upload className="h-16 w-16 animate-bounce" />
            ) : (
              <FileImage className="h-16 w-16" />
            )}
          </div>

          {isDragReject ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-red-600">
                Invalid file type
              </p>
              <p className="text-sm text-red-500">
                Please upload only JPG, PNG, or PDF files
              </p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">
                Drop files here...
              </p>
              <p className="text-sm text-blue-500">
                Release to upload
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-gray-900">
                Drag & drop files here
              </p>
              <p className="text-sm text-gray-600">
                or click to browse from your computer
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={disabled}
                onClick={(e) => e.stopPropagation()}
              >
                Browse Files
              </Button>
            </div>
          )}

          <div className="mt-6 space-y-1 text-xs text-gray-500">
            <p>Supported formats: JPG, JPEG, PNG, PDF</p>
            <p>Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB per file</p>
            <p>Maximum files: {maxFiles} at a time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
