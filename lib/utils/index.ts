/**
 * Utility functions index file
 * Re-exports all utility functions for convenient importing
 */

// File utilities
export {
  validateFileType,
  validateFileSize,
  generateFileName,
  convertToBase64,
  base64ToBlob,
  getFileExtension,
  getMimeType,
} from './file-utils';

// Date utilities
export {
  formatDate,
  getCurrentDate,
  parseDate,
  formatRelativeDate,
} from './date-utils';

// Validation utilities
export {
  validatePatientId,
  sanitizePatientId,
  validateFiles,
  validatePatientIds,
  type FileValidationError,
  type FileValidationResult,
} from './validation';

// Download utilities
export {
  downloadFile,
  createZip,
  downloadZip,
  downloadPatientFilesAsZip,
  validateFilesForZip,
  type FileMetadata,
} from './download-utils';
