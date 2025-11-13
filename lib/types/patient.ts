import type { FileMetadata } from './file';

export interface Patient {
  id: string;
  createdAt: string;
  updatedAt: string;
  totalFiles: number;
  totalSize: number;
  dates: Record<string, DateGroup>;
}

export interface DateGroup {
  date: string; // YYYY-MM-DD
  files: FileMetadata[];
}
