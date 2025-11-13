import type { Patient } from './patient';

export interface StorageInfo {
  used: number; // bytes
  available: number; // bytes
  limit: number; // bytes
  usagePercentage: number;
}

export interface StorageMetadata {
  totalPatients: number;
  totalFiles: number;
  totalSize: number;
  lastUpdated: string;
}

export interface PatientMediaStore {
  patients: Record<string, Patient>;
  metadata: StorageMetadata;
}
