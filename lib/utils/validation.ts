/**
 * Validation utility functions for the Patient Photo Management System
 */

import { validateFileType, validateFileSize } from './file-utils';

/**
 * Validates a patient ID format
 * @param id - The patient ID to validate
 * @returns true if valid (alphanumeric, 3-20 characters), false otherwise
 */
export function validatePatientId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Check length (3-20 characters)
  if (id.length < 3 || id.length > 20) {
    return false;
  }

  // Check if alphanumeric (letters, numbers, underscores, and hyphens allowed)
  const alphanumericPattern = /^[a-zA-Z0-9_-]+$/;
  return alphanumericPattern.test(id);
}

/**
 * Sanitizes a patient ID by removing invalid characters
 * @param id - The patient ID to sanitize
 * @returns Sanitized patient ID
 */
export function sanitizePatientId(id: string): string {
  if (!id || typeof id !== 'string') {
    return '';
  }

  // Remove all characters except alphanumeric, underscore, and hyphen
  let sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '');

  // Trim to maximum 20 characters
  if (sanitized.length > 20) {
    sanitized = sanitized.substring(0, 20);
  }

  // Ensure minimum 3 characters by padding with zeros if needed
  if (sanitized.length < 3 && sanitized.length > 0) {
    sanitized = sanitized.padEnd(3, '0');
  }

  return sanitized;
}

/**
 * File validation error interface
 */
export interface FileValidationError {
  file: File;
  error: string;
}

/**
 * File validation result interface
 */
export interface FileValidationResult {
  valid: File[];
  invalid: FileValidationError[];
}

/**
 * Validates an array of files
 * @param files - Array of files to validate
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns Object containing valid files and invalid files with error messages
 */
export function validateFiles(
  files: File[],
  maxSize: number = 5 * 1024 * 1024
): FileValidationResult {
  const valid: File[] = [];
  const invalid: FileValidationError[] = [];

  files.forEach((file) => {
    const errors: string[] = [];

    // Validate file type
    if (!validateFileType(file)) {
      errors.push('Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed.');
    }

    // Validate file size
    if (!validateFileSize(file, maxSize)) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      errors.push(`File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB).`);
    }

    // Check if file name is valid
    if (!file.name || file.name.trim() === '') {
      errors.push('File name is empty or invalid.');
    }

    // If there are errors, add to invalid array
    if (errors.length > 0) {
      invalid.push({
        file,
        error: errors.join(' '),
      });
    } else {
      valid.push(file);
    }
  });

  return { valid, invalid };
}

/**
 * Validates multiple patient IDs at once
 * @param ids - Array of patient IDs to validate
 * @returns Object containing valid and invalid IDs
 */
export function validatePatientIds(ids: string[]): {
  valid: string[];
  invalid: Array<{ id: string; error: string }>;
} {
  const valid: string[] = [];
  const invalid: Array<{ id: string; error: string }> = [];

  ids.forEach((id) => {
    if (validatePatientId(id)) {
      valid.push(id);
    } else {
      let error = 'Invalid patient ID.';

      if (!id || id.length === 0) {
        error = 'Patient ID is empty.';
      } else if (id.length < 3) {
        error = 'Patient ID must be at least 3 characters long.';
      } else if (id.length > 20) {
        error = 'Patient ID must not exceed 20 characters.';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        error = 'Patient ID must contain only alphanumeric characters, underscores, and hyphens.';
      }

      invalid.push({ id, error });
    }
  });

  return { valid, invalid };
}
