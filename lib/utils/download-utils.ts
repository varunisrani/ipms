/**
 * Download utility functions for the Patient Photo Management System
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { base64ToBlob } from './file-utils';

/**
 * File metadata interface
 */
export interface FileMetadata {
  id: string;
  fileName: string;
  fileData: string; // base64 encoded data
  mimeType: string;
  fileSize: number;
  uploadDate: string;
  patientId: string;
}

/**
 * Downloads a single file to the user's device
 * @param file - The file metadata containing file information
 */
export function downloadFile(file: FileMetadata): void {
  try {
    // Convert base64 to blob
    const blob = base64ToBlob(file.fileData, file.mimeType);

    // Use file-saver to trigger download
    saveAs(blob, file.fileName);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download file: ${file.fileName}`);
  }
}

/**
 * Creates a ZIP file from multiple files
 * @param files - Array of file metadata objects
 * @param zipName - Name for the ZIP file (without extension)
 * @returns Promise that resolves to a Blob containing the ZIP file
 */
export async function createZip(files: FileMetadata[], zipName: string): Promise<Blob> {
  try {
    if (files.length === 0) {
      throw new Error('No files provided to create ZIP');
    }

    const zip = new JSZip();

    // Add each file to the ZIP
    files.forEach((file) => {
      try {
        // Remove data URL prefix if present
        const base64Data = file.fileData.includes(',')
          ? file.fileData.split(',')[1]
          : file.fileData;

        // Add file to ZIP with its original filename
        zip.file(file.fileName, base64Data, { base64: true });
      } catch (error) {
        console.error(`Error adding file ${file.fileName} to ZIP:`, error);
        // Continue with other files even if one fails
      }
    });

    // Generate ZIP file
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6, // Moderate compression level
      },
    });

    return blob;
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
}

/**
 * Downloads multiple files as a ZIP archive
 * @param files - Array of file metadata objects
 * @param zipName - Name for the ZIP file (without extension)
 * @returns Promise that resolves when download is initiated
 */
export async function downloadZip(files: FileMetadata[], zipName: string): Promise<void> {
  try {
    if (files.length === 0) {
      throw new Error('No files provided to download');
    }

    // Create ZIP blob
    const zipBlob = await createZip(files, zipName);

    // Ensure zipName ends with .zip
    const fileName = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;

    // Use file-saver to trigger download
    saveAs(zipBlob, fileName);
  } catch (error) {
    console.error('Error downloading ZIP file:', error);
    throw new Error('Failed to download ZIP file');
  }
}

/**
 * Downloads files for a specific patient as a ZIP archive
 * @param files - Array of file metadata objects
 * @param patientId - The patient ID to use in the filename
 * @returns Promise that resolves when download is initiated
 */
export async function downloadPatientFilesAsZip(
  files: FileMetadata[],
  patientId: string
): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const zipName = `patient_${patientId}_files_${timestamp}`;
  return downloadZip(files, zipName);
}

/**
 * Validates files before creating ZIP
 * @param files - Array of file metadata objects
 * @returns Object with validation results
 */
export function validateFilesForZip(files: FileMetadata[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!files || files.length === 0) {
    errors.push('No files provided');
  }

  if (files && files.length > 1000) {
    errors.push('Too many files (maximum 1000 files per ZIP)');
  }

  const totalSize = files.reduce((sum, file) => sum + (file.fileSize || 0), 0);
  const maxSize = 500 * 1024 * 1024; // 500MB

  if (totalSize > maxSize) {
    errors.push(`Total file size exceeds maximum (${(maxSize / 1024 / 1024).toFixed(0)}MB)`);
  }

  files.forEach((file, index) => {
    if (!file.fileName) {
      errors.push(`File at index ${index} has no filename`);
    }
    if (!file.fileData) {
      errors.push(`File ${file.fileName || index} has no data`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
