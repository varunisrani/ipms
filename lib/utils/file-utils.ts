/**
 * File utility functions for handling file operations in the Patient Photo Management System
 */

// Accepted file types and their MIME types
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

/**
 * Validates if the file type is accepted (JPG, JPEG, PNG, PDF)
 * @param file - The file to validate
 * @returns true if file type is valid, false otherwise
 */
export function validateFileType(file: File): boolean {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Check MIME type
  if (Object.keys(ACCEPTED_FILE_TYPES).includes(mimeType)) {
    return true;
  }

  // Fallback: Check file extension
  const extension = getFileExtension(fileName);
  return ACCEPTED_EXTENSIONS.includes(extension.toLowerCase());
}

/**
 * Validates if the file size is within the allowed limit
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns true if file size is valid, false otherwise
 */
export function validateFileSize(file: File, maxSize: number = 5 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

/**
 * Generates a standardized filename for patient photos
 * @param patientId - The patient identifier
 * @param date - The date string (YYYY-MM-DD format)
 * @param sequence - The sequence number for multiple files on same date
 * @param extension - The file extension (with or without dot)
 * @returns Formatted filename (e.g., "PATIENT123_2024-01-15_001.jpg")
 */
export function generateFileName(
  patientId: string,
  date: string,
  sequence: number,
  extension: string
): string {
  // Ensure extension has a dot
  const ext = extension.startsWith('.') ? extension : `.${extension}`;

  // Format sequence with leading zeros (3 digits)
  const seq = sequence.toString().padStart(3, '0');

  // Clean patient ID (remove special characters except underscore and hyphen)
  const cleanPatientId = patientId.replace(/[^a-zA-Z0-9_-]/g, '');

  return `${cleanPatientId}_${date}_${seq}${ext}`;
}

/**
 * Converts a File object to base64 string
 * @param file - The file to convert
 * @returns Promise that resolves to base64 string
 */
export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 string to Blob
 * @param base64 - The base64 string (with or without data URL prefix)
 * @param mimeType - The MIME type of the blob
 * @returns Blob object
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // Decode base64 string
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Gets the file extension from a filename
 * @param filename - The filename to extract extension from
 * @returns The file extension including the dot (e.g., ".jpg")
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }

  return filename.substring(lastDotIndex).toLowerCase();
}

/**
 * Gets the MIME type based on file extension
 * @param filename - The filename to get MIME type for
 * @returns The MIME type or 'application/octet-stream' as default
 */
export function getMimeType(filename: string): string {
  const extension = getFileExtension(filename);

  const mimeTypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
  };

  return mimeTypeMap[extension] || 'application/octet-stream';
}
