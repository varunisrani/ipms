# Utility Functions - Patient Photo Management System

This directory contains utility functions for Phase 1 of the Patient Photo Management System.

## Files Overview

### 1. file-utils.ts
File handling and manipulation utilities.

**Functions:**
- `validateFileType(file: File): boolean` - Validates file types (JPG, JPEG, PNG, PDF)
- `validateFileSize(file: File, maxSize?: number): boolean` - Validates file size (default: 5MB)
- `generateFileName(patientId, date, sequence, extension): string` - Generates standardized filenames
- `convertToBase64(file: File): Promise<string>` - Converts File to base64
- `base64ToBlob(base64, mimeType): Blob` - Converts base64 to Blob
- `getFileExtension(filename): string` - Extracts file extension
- `getMimeType(filename): string` - Gets MIME type from filename

### 2. date-utils.ts
Date formatting and manipulation utilities using date-fns.

**Functions:**
- `formatDate(date, format?): string` - Formats date with custom format (default: 'yyyy-MM-dd')
- `getCurrentDate(): string` - Returns current date in YYYY-MM-DD format
- `parseDate(dateString): Date` - Parses various date string formats
- `formatRelativeDate(date): string` - Returns relative date strings ("Today", "Yesterday", "2 days ago")

### 3. validation.ts
Validation utilities for patient data and files.

**Functions:**
- `validatePatientId(id): boolean` - Validates patient ID (alphanumeric, 3-20 chars)
- `sanitizePatientId(id): string` - Sanitizes patient ID by removing invalid characters
- `validateFiles(files): FileValidationResult` - Validates multiple files and returns results
- `validatePatientIds(ids): ValidationResult` - Validates multiple patient IDs

**Interfaces:**
- `FileValidationError` - Error info for invalid files
- `FileValidationResult` - Contains valid and invalid files

### 4. download-utils.ts
File download utilities using jszip and file-saver.

**Functions:**
- `downloadFile(file: FileMetadata): void` - Downloads a single file
- `createZip(files, zipName): Promise<Blob>` - Creates ZIP from multiple files
- `downloadZip(files, zipName): Promise<void>` - Downloads files as ZIP
- `downloadPatientFilesAsZip(files, patientId): Promise<void>` - Downloads patient files with auto-generated name
- `validateFilesForZip(files): ValidationResult` - Validates files before ZIP creation

**Interfaces:**
- `FileMetadata` - File metadata structure

## Usage Examples

```typescript
// Import utilities
import {
  validateFileType,
  validateFileSize,
  formatRelativeDate,
  validatePatientId,
  downloadZip
} from '@/lib/utils';

// Validate a file
const isValid = validateFileType(file) && validateFileSize(file);

// Format a date
const relativeDate = formatRelativeDate('2024-01-15'); // "2 days ago"

// Validate patient ID
if (validatePatientId(patientId)) {
  // Process patient ID
}

// Download files as ZIP
await downloadZip(files, 'patient-photos');
```

## Dependencies

- **date-fns**: Date manipulation and formatting
- **jszip**: ZIP file creation
- **file-saver**: File download functionality

## Testing

Run TypeScript compilation check:
```bash
npx tsc --noEmit lib/utils/*.ts
```
