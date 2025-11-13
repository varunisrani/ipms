export interface FileMetadata {
  id: string;
  patientId: string;
  originalName: string;
  storedName: string; // [PATIENT_ID]_[DATE]_[SEQUENCE].[ext]
  fileType: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  date: string; // YYYY-MM-DD
  sequence: number;
  base64Data: string;
}

export interface UploadFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}
