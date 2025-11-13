/**
 * File storage service for managing patient files and metadata
 * Provides CRUD operations for patients and their files using localStorage
 */

import type { Patient, DateGroup, FileMetadata, PatientMediaStore, StorageMetadata } from '../types';
import { getItem, setItem } from './local-storage';

// Main localStorage key for patient media data
const STORAGE_KEY = 'patientMedia';

/**
 * Initialize storage with empty structure if not exists
 */
export function initializeStorage(): void {
  try {
    const existing = getItem<PatientMediaStore>(STORAGE_KEY);

    if (!existing) {
      const initialStore: PatientMediaStore = {
        patients: {},
        metadata: {
          totalPatients: 0,
          totalFiles: 0,
          totalSize: 0,
          lastUpdated: new Date().toISOString(),
        },
      };

      setItem(STORAGE_KEY, initialStore);
      console.log('Storage initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw new Error('Failed to initialize storage');
  }
}

/**
 * Get the current store from localStorage
 * @returns PatientMediaStore or null if not found
 */
function getStore(): PatientMediaStore | null {
  return getItem<PatientMediaStore>(STORAGE_KEY);
}

/**
 * Save the store to localStorage
 * @param store - The store to save
 * @returns True if successful
 */
function saveStore(store: PatientMediaStore): boolean {
  return setItem(STORAGE_KEY, store);
}

/**
 * Create a new patient entry
 * @param patientId - Unique patient identifier
 * @returns Created patient object
 */
export function createPatient(patientId: string): Patient {
  try {
    const store = getStore();

    if (!store) {
      initializeStorage();
      const newStore = getStore();
      if (!newStore) {
        throw new Error('Failed to initialize storage');
      }
      return createPatient(patientId); // Retry after initialization
    }

    // Check if patient already exists
    if (store.patients[patientId]) {
      console.log(`Patient ${patientId} already exists`);
      return store.patients[patientId];
    }

    // Create new patient
    const newPatient: Patient = {
      id: patientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalFiles: 0,
      totalSize: 0,
      dates: {},
    };

    // Add to store
    store.patients[patientId] = newPatient;
    store.metadata.totalPatients += 1;
    store.metadata.lastUpdated = new Date().toISOString();

    // Save to localStorage
    if (!saveStore(store)) {
      throw new Error('Failed to save patient to storage');
    }

    console.log(`Patient ${patientId} created successfully`);
    return newPatient;
  } catch (error) {
    console.error(`Error creating patient ${patientId}:`, error);
    throw error;
  }
}

/**
 * Get a patient by ID
 * @param patientId - Patient identifier
 * @returns Patient object or null if not found
 */
export function getPatient(patientId: string): Patient | null {
  try {
    const store = getStore();

    if (!store) {
      console.warn('Storage not initialized');
      return null;
    }

    return store.patients[patientId] || null;
  } catch (error) {
    console.error(`Error getting patient ${patientId}:`, error);
    return null;
  }
}

/**
 * Get all patients
 * @returns Array of all patients
 */
export function getAllPatients(): Patient[] {
  try {
    const store = getStore();

    if (!store) {
      console.warn('Storage not initialized');
      return [];
    }

    return Object.values(store.patients);
  } catch (error) {
    console.error('Error getting all patients:', error);
    return [];
  }
}

/**
 * Add files to a patient
 * @param patientId - Patient identifier
 * @param files - Array of file metadata to add
 * @returns True if successful
 */
export function addFiles(patientId: string, files: FileMetadata[]): boolean {
  try {
    const store = getStore();

    if (!store) {
      throw new Error('Storage not initialized');
    }

    // Get or create patient
    let patient = store.patients[patientId];
    if (!patient) {
      patient = createPatient(patientId);
      // Refresh store after creating patient
      const updatedStore = getStore();
      if (!updatedStore) {
        throw new Error('Failed to get updated store');
      }
      patient = updatedStore.patients[patientId];
    }

    // Group files by date and add them
    let totalFilesAdded = 0;
    let totalSizeAdded = 0;

    files.forEach((file) => {
      const dateKey = file.date;

      // Initialize date group if it doesn't exist
      if (!patient.dates[dateKey]) {
        patient.dates[dateKey] = {
          date: dateKey,
          files: [],
        };
      }

      // Add file to date group
      patient.dates[dateKey].files.push(file);
      totalFilesAdded += 1;
      totalSizeAdded += file.size;
    });

    // Update patient stats
    patient.totalFiles += totalFilesAdded;
    patient.totalSize += totalSizeAdded;
    patient.updatedAt = new Date().toISOString();

    // Update global metadata
    store.metadata.totalFiles += totalFilesAdded;
    store.metadata.totalSize += totalSizeAdded;
    store.metadata.lastUpdated = new Date().toISOString();

    // Save to localStorage
    if (!saveStore(store)) {
      throw new Error('Failed to save files to storage');
    }

    console.log(`Added ${totalFilesAdded} files to patient ${patientId}`);
    return true;
  } catch (error) {
    console.error(`Error adding files to patient ${patientId}:`, error);
    return false;
  }
}

/**
 * Get files for a patient, optionally filtered by date
 * @param patientId - Patient identifier
 * @param date - Optional date filter (YYYY-MM-DD)
 * @returns Array of file metadata
 */
export function getFiles(patientId: string, date?: string): FileMetadata[] {
  try {
    const patient = getPatient(patientId);

    if (!patient) {
      console.warn(`Patient ${patientId} not found`);
      return [];
    }

    // If date is specified, return files for that date only
    if (date) {
      const dateGroup = patient.dates[date];
      return dateGroup ? dateGroup.files : [];
    }

    // Otherwise, return all files for the patient
    const allFiles: FileMetadata[] = [];
    Object.values(patient.dates).forEach((dateGroup) => {
      allFiles.push(...dateGroup.files);
    });

    return allFiles;
  } catch (error) {
    console.error(`Error getting files for patient ${patientId}:`, error);
    return [];
  }
}

/**
 * Delete a specific file
 * @param patientId - Patient identifier
 * @param fileId - File identifier
 * @returns True if successful
 */
export function deleteFile(patientId: string, fileId: string): boolean {
  try {
    const store = getStore();

    if (!store) {
      throw new Error('Storage not initialized');
    }

    const patient = store.patients[patientId];
    if (!patient) {
      console.warn(`Patient ${patientId} not found`);
      return false;
    }

    // Find and remove the file
    let fileFound = false;
    let deletedFileSize = 0;

    for (const dateKey in patient.dates) {
      const dateGroup = patient.dates[dateKey];
      const fileIndex = dateGroup.files.findIndex((f) => f.id === fileId);

      if (fileIndex !== -1) {
        const deletedFile = dateGroup.files[fileIndex];
        deletedFileSize = deletedFile.size;

        // Remove file from array
        dateGroup.files.splice(fileIndex, 1);

        // If no files left for this date, remove the date group
        if (dateGroup.files.length === 0) {
          delete patient.dates[dateKey];
        }

        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      console.warn(`File ${fileId} not found for patient ${patientId}`);
      return false;
    }

    // Update patient stats
    patient.totalFiles -= 1;
    patient.totalSize -= deletedFileSize;
    patient.updatedAt = new Date().toISOString();

    // Update global metadata
    store.metadata.totalFiles -= 1;
    store.metadata.totalSize -= deletedFileSize;
    store.metadata.lastUpdated = new Date().toISOString();

    // Save to localStorage
    if (!saveStore(store)) {
      throw new Error('Failed to save changes after deleting file');
    }

    console.log(`File ${fileId} deleted successfully from patient ${patientId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    return false;
  }
}

/**
 * Delete a patient and all their files
 * @param patientId - Patient identifier
 * @returns True if successful
 */
export function deletePatient(patientId: string): boolean {
  try {
    const store = getStore();

    if (!store) {
      throw new Error('Storage not initialized');
    }

    const patient = store.patients[patientId];
    if (!patient) {
      console.warn(`Patient ${patientId} not found`);
      return false;
    }

    // Update global metadata
    store.metadata.totalPatients -= 1;
    store.metadata.totalFiles -= patient.totalFiles;
    store.metadata.totalSize -= patient.totalSize;
    store.metadata.lastUpdated = new Date().toISOString();

    // Remove patient
    delete store.patients[patientId];

    // Save to localStorage
    if (!saveStore(store)) {
      throw new Error('Failed to save changes after deleting patient');
    }

    console.log(`Patient ${patientId} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting patient ${patientId}:`, error);
    return false;
  }
}

/**
 * Update metadata by recalculating from actual data
 * Useful for fixing inconsistencies
 */
export function updateMetadata(): void {
  try {
    const store = getStore();

    if (!store) {
      throw new Error('Storage not initialized');
    }

    let totalFiles = 0;
    let totalSize = 0;
    const totalPatients = Object.keys(store.patients).length;

    // Recalculate from each patient
    Object.values(store.patients).forEach((patient) => {
      let patientFiles = 0;
      let patientSize = 0;

      Object.values(patient.dates).forEach((dateGroup: DateGroup) => {
        dateGroup.files.forEach((file) => {
          patientFiles += 1;
          patientSize += file.size;
        });
      });

      // Update patient stats
      patient.totalFiles = patientFiles;
      patient.totalSize = patientSize;

      totalFiles += patientFiles;
      totalSize += patientSize;
    });

    // Update global metadata
    store.metadata = {
      totalPatients,
      totalFiles,
      totalSize,
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage
    if (!saveStore(store)) {
      throw new Error('Failed to save updated metadata');
    }

    console.log('Metadata updated successfully');
  } catch (error) {
    console.error('Error updating metadata:', error);
    throw error;
  }
}

/**
 * Get storage metadata
 * @returns Storage metadata or null if not found
 */
export function getMetadata(): StorageMetadata | null {
  try {
    const store = getStore();
    return store ? store.metadata : null;
  } catch (error) {
    console.error('Error getting metadata:', error);
    return null;
  }
}

/**
 * Export all data as JSON string
 * @returns JSON string of all data
 */
export function exportData(): string | null {
  try {
    const store = getStore();
    if (!store) {
      console.warn('No data to export');
      return null;
    }
    return JSON.stringify(store, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

/**
 * Import data from JSON string
 * @param jsonData - JSON string of data to import
 * @returns True if successful
 */
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as PatientMediaStore;

    // Validate structure
    if (!data.patients || !data.metadata) {
      throw new Error('Invalid data structure');
    }

    return saveStore(data);
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
