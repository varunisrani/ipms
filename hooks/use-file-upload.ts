"use client";

import { useState, useCallback } from "react";

/**
 * Upload progress information for a single file
 */
export interface FileUploadProgress {
  /** Name of the file being uploaded */
  fileName: string;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Current status of the upload */
  status: "pending" | "uploading" | "completed" | "error";
  /** Error message if upload failed */
  error?: string;
}

/**
 * Options for file upload
 */
export interface UploadOptions {
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed file types (MIME types or extensions) */
  allowedTypes?: string[];
  /** Callback function called on upload progress */
  onProgress?: (progress: FileUploadProgress[]) => void;
  /** Callback function called on successful upload */
  onSuccess?: (files: UploadedFile[]) => void;
  /** Callback function called on upload error */
  onError?: (error: Error) => void;
}

/**
 * Uploaded file information
 */
export interface UploadedFile {
  /** Unique identifier for the uploaded file */
  id: string;
  /** Original file name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload timestamp */
  uploadedAt: Date;
  /** Storage key or URL */
  storageKey: string;
}

/**
 * Return type for useFileUpload hook
 */
export interface UseFileUploadReturn {
  /** Function to upload files */
  uploadFiles: (files: File[], options?: UploadOptions) => Promise<UploadedFile[]>;
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
 * Custom hook for handling file uploads
 *
 * **Note: This is a Phase 1 structure. Full implementation will be completed in Phase 2.**
 *
 * This hook provides a clean interface for uploading files with progress tracking,
 * error handling, and validation. In Phase 2, this will be integrated with the
 * storage backend (localStorage/IndexedDB).
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
 *       maxSize: 5 * 1024 * 1024, // 5MB
 *       allowedTypes: ['image/jpeg', 'image/png'],
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

  /**
   * Validate a single file against upload options
   * @param file - File to validate
   * @param options - Upload options containing validation rules
   * @returns Validation error message or null if valid
   */
  const validateFile = useCallback(
    (file: File, options?: UploadOptions): string | null => {
      // Check file size
      const maxSize = options?.maxSize || 5 * 1024 * 1024; // Default 5MB
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      // Check file type
      if (options?.allowedTypes && options.allowedTypes.length > 0) {
        const isAllowed = options.allowedTypes.some((type) => {
          if (type.startsWith(".")) {
            // Extension check
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          // MIME type check
          return file.type === type || file.type.startsWith(type.split("/")[0]);
        });

        if (!isAllowed) {
          return `File "${file.name}" type not allowed. Allowed types: ${options.allowedTypes.join(", ")}`;
        }
      }

      return null;
    },
    []
  );

  /**
   * Upload files with progress tracking
   *
   * **Phase 2 Implementation Notes:**
   * - Integrate with storage backend (localStorage/IndexedDB)
   * - Implement actual file reading and storage
   * - Add thumbnail generation for images
   * - Implement chunked upload for large files
   * - Add retry logic for failed uploads
   * - Implement parallel upload with concurrency control
   *
   * @param files - Array of files to upload
   * @param options - Upload options
   * @returns Promise resolving to array of uploaded file information
   */
  const uploadFiles = useCallback(
    async (files: File[], options?: UploadOptions): Promise<UploadedFile[]> => {
      setIsUploading(true);
      setError(null);

      // Initialize progress tracking
      const initialProgress: FileUploadProgress[] = files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "pending" as const,
      }));
      setProgress(initialProgress);

      try {
        // Validate all files first
        for (const file of files) {
          const validationError = validateFile(file, options);
          if (validationError) {
            throw new Error(validationError);
          }
        }

        // TODO Phase 2: Implement actual upload logic
        // This is a placeholder structure for Phase 2 implementation
        const uploadedFiles: UploadedFile[] = [];

        // Simulate upload for structure demonstration
        // In Phase 2, replace this with actual file storage logic
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Update progress to uploading
          setProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "uploading" as const, progress: 0 } : p
            )
          );

          // TODO Phase 2: Implement file reading and storage
          // - Read file using FileReader API
          // - Convert to appropriate format (base64, ArrayBuffer, etc.)
          // - Store in localStorage or IndexedDB
          // - Generate thumbnail if image
          // - Track progress during processing

          // Placeholder uploaded file info
          const uploadedFile: UploadedFile = {
            id: `file-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            storageKey: `photos/${Date.now()}-${file.name}`,
          };

          uploadedFiles.push(uploadedFile);

          // Update progress to completed
          setProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "completed" as const, progress: 100 } : p
            )
          );

          // Call progress callback if provided
          if (options?.onProgress) {
            options.onProgress(
              initialProgress.map((p, idx) =>
                idx <= i
                  ? { ...p, status: "completed" as const, progress: 100 }
                  : p
              )
            );
          }
        }

        // Call success callback if provided
        if (options?.onSuccess) {
          options.onSuccess(uploadedFiles);
        }

        return uploadedFiles;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);

        // Update progress to show errors
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
      }
    },
    [validateFile]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Cancel ongoing upload
   *
   * **Phase 2 Implementation:**
   * - Implement AbortController for cancelling fetch requests
   * - Clean up partially uploaded files
   * - Reset progress state
   */
  const cancelUpload = useCallback(() => {
    // TODO Phase 2: Implement upload cancellation
    setIsUploading(false);
    setProgress([]);
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
