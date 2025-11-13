"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import type { FileMetadata } from "@/lib/types";
import { addFiles, getFiles } from "@/lib/storage/file-storage";
import { convertToBase64, generateFileName, getFileExtension } from "@/lib/utils/file-utils";
import { validateFiles } from "@/lib/utils/validation";

/**
 * Upload progress information for a single file
 */
export interface FileUploadProgress {
  /** Name of the file being uploaded */
  fileName: string;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Current status of the upload */
  status: "pending" | "uploading" | "success" | "error";
  /** Error message if upload failed */
  error?: string;
}

/**
 * Options for file upload
 */
export interface UploadOptions {
  /** Patient ID for file association */
  patientId: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Callback function called on upload progress */
  onProgress?: (progress: FileUploadProgress[]) => void;
  /** Callback function called on successful upload */
  onSuccess?: (files: FileMetadata[]) => void;
  /** Callback function called on upload error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useFileUpload hook
 */
export interface UseFileUploadReturn {
  /** Function to upload files */
  uploadFiles: (files: File[], options: UploadOptions) => Promise<FileMetadata[]>;
  /** Whether files are currently being uploaded */
  isUploading: boolean;
  /** Array of upload progress for each file */
  progress: FileUploadProgress[];
  /** Error message if upload failed */
  error: string | null;
  /** Function to clear error state */
  clearError: () => void;
  /** Function to cancel ongoing upload */
  cancelUpload: () => void;
}

/**
 * Custom hook for handling file uploads with localStorage integration
 *
 * This hook provides a clean interface for uploading files with progress tracking,
 * error handling, validation, and storage integration.
 *
 * @returns {UseFileUploadReturn} File upload functions and state
 *
 * @example
 * ```tsx
 * const { uploadFiles, isUploading, progress, error } = useFileUpload();
 *
 * const handleUpload = async (files: File[]) => {
 *   try {
 *     const uploaded = await uploadFiles(files, {
 *       patientId: 'PAT001',
 *       maxSize: 5 * 1024 * 1024, // 5MB
 *       onProgress: (progress) => console.log(progress),
 *     });
 *     console.log('Uploaded files:', uploaded);
 *   } catch (err) {
 *     console.error('Upload failed:', err);
 *   }
 * };
 * ```
 */
export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<FileUploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shouldCancel, setShouldCancel] = useState(false);

  /**
   * Upload files with progress tracking and storage integration
   *
   * @param files - Array of files to upload
   * @param options - Upload options including patient ID
   * @returns Promise resolving to array of uploaded file metadata
   */
  const uploadFiles = useCallback(
    async (files: File[], options: UploadOptions): Promise<FileMetadata[]> => {
      setIsUploading(true);
      setError(null);
      setShouldCancel(false);

      // Initialize progress tracking
      const initialProgress: FileUploadProgress[] = files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "pending" as const,
      }));
      setProgress(initialProgress);

      try {
        const { patientId, maxSize = 5 * 1024 * 1024 } = options;

        // Validate all files first
        const { valid, invalid } = validateFiles(files, maxSize);

        if (invalid.length > 0) {
          const errorMsg = invalid.map((item) => `${item.file.name}: ${item.error}`).join("; ");
          throw new Error(errorMsg);
        }

        // Get current date for file naming
        const currentDate = format(new Date(), "yyyy-MM-dd");

        // Get existing files for this patient and date to determine sequence numbers
        const existingFiles = getFiles(patientId, currentDate);
        let sequence = existingFiles.length + 1;

        const uploadedFiles: FileMetadata[] = [];

        // Process each file
        for (let i = 0; i < valid.length; i++) {
          // Check if upload was cancelled
          if (shouldCancel) {
            throw new Error("Upload cancelled by user");
          }

          const file = valid[i];

          // Update progress to uploading
          setProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "uploading" as const, progress: 10 } : p
            )
          );

          try {
            // Convert file to base64 (progress: 10% -> 50%)
            const base64Data = await convertToBase64(file);

            // Update progress
            setProgress((prev) =>
              prev.map((p, idx) => (idx === i ? { ...p, progress: 50 } : p))
            );

            // Generate filename
            const extension = getFileExtension(file.name);
            const storedName = generateFileName(patientId, currentDate, sequence, extension);

            // Create file metadata
            const fileMetadata: FileMetadata = {
              id: `${patientId}-${currentDate}-${sequence}-${Date.now()}`,
              patientId,
              originalName: file.name,
              storedName,
              fileType: extension.replace(".", "").toUpperCase(),
              mimeType: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              date: currentDate,
              sequence,
              base64Data,
            };

            // Update progress
            setProgress((prev) =>
              prev.map((p, idx) => (idx === i ? { ...p, progress: 75 } : p))
            );

            uploadedFiles.push(fileMetadata);
            sequence++; // Increment sequence for next file

            // Update progress to success
            setProgress((prev) =>
              prev.map((p, idx) =>
                idx === i ? { ...p, status: "success" as const, progress: 100 } : p
              )
            );

            // Call progress callback if provided
            if (options?.onProgress) {
              const currentProgress = initialProgress.map((p, idx) =>
                idx < i
                  ? { ...p, status: "success" as const, progress: 100 }
                  : idx === i
                  ? { ...p, status: "success" as const, progress: 100 }
                  : p
              );
              options.onProgress(currentProgress);
            }
          } catch (fileError) {
            const errorMsg =
              fileError instanceof Error
                ? fileError.message
                : `Failed to upload ${file.name}`;

            // Update progress to error for this file
            setProgress((prev) =>
              prev.map((p, idx) =>
                idx === i
                  ? { ...p, status: "error" as const, error: errorMsg, progress: 0 }
                  : p
              )
            );

            // Continue with other files instead of stopping
            console.error(`Error uploading ${file.name}:`, fileError);
          }
        }

        // If no files were successfully uploaded, throw error
        if (uploadedFiles.length === 0) {
          throw new Error("No files were successfully uploaded");
        }

        // Save all uploaded files to storage
        const saved = addFiles(patientId, uploadedFiles);

        if (!saved) {
          throw new Error("Failed to save files to storage");
        }

        // Call success callback if provided
        if (options?.onSuccess) {
          options.onSuccess(uploadedFiles);
        }

        return uploadedFiles;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);

        // Update progress to show errors for pending/uploading files
        setProgress((prev) =>
          prev.map((p) =>
            p.status === "uploading" || p.status === "pending"
              ? { ...p, status: "error" as const, error: errorMessage }
              : p
          )
        );

        // Call error callback if provided
        if (options?.onError && err instanceof Error) {
          options.onError(err);
        }

        throw err;
      } finally {
        setIsUploading(false);
        setShouldCancel(false);
      }
    },
    [shouldCancel]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Cancel ongoing upload
   */
  const cancelUpload = useCallback(() => {
    setShouldCancel(true);
    setError("Upload cancelled");
  }, []);

  return {
    uploadFiles,
    isUploading,
    progress,
    error,
    clearError,
    cancelUpload,
  };
}
