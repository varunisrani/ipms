'use client';

import { useState, useRef, DragEvent } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function NewUploadPage() {
  const [patientId, setPatientId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate patient ID (alphanumeric, 3-20 characters)
  const isPatientIdValid = /^[a-zA-Z0-9]{3,20}$/.test(patientId);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach((file) => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}: Invalid file type. Only JPG, PNG, and PDF are allowed.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        alert(`${file.name}: File too large. Maximum size is 5MB.`);
        return;
      }

      validFiles.push(file);
    });

    // Check total files limit
    if (selectedFiles.length + validFiles.length > 10) {
      alert('Maximum 10 files allowed per upload.');
      return;
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  // Handle drag & drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isPatientIdValid || isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isPatientIdValid || isUploading) return;
    handleFileSelect(e.dataTransfer.files);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Handle upload
  const handleUpload = async () => {
    if (!isPatientIdValid || selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Get existing data
      const patientsData = JSON.parse(localStorage.getItem('patients') || '{}');

      // Initialize patient if doesn't exist
      if (!patientsData[patientId]) {
        patientsData[patientId] = {
          id: patientId,
          files: [],
          createdAt: new Date().toISOString()
        };
      }

      // Process files
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Read file as base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Create file record
        const fileRecord = {
          id: `${patientId}_${Date.now()}_${i}`,
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadedAt: new Date().toISOString()
        };

        patientsData[patientId].files.push(fileRecord);
      }

      // Save to localStorage
      localStorage.setItem('patients', JSON.stringify(patientsData));

      alert(`Successfully uploaded ${selectedFiles.length} file(s) for patient ${patientId}!`);
      setSelectedFiles([]);
      setPatientId('');
    } catch (error) {
      alert('Error uploading files. Please try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setPatientId('');
    setSelectedFiles([]);
    setIsUploading(false);
  };

  const canUpload = isPatientIdValid && selectedFiles.length > 0 && !isUploading;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Upload Patient Photos</h1>
        <p className={styles.subtitle}>
          Upload medical images and documents for patient records
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main Section */}
        <div className={styles.mainSection}>
          {/* Step 1: Patient ID */}
          <div className={styles.card}>
            <span className={styles.stepBadge}>Step 1</span>
            <h2 className={styles.cardTitle}>Enter Patient ID</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="patientId" className={styles.label}>
                Patient ID
              </label>
              <input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="e.g., P12345"
                disabled={isUploading}
                className={`${styles.input} ${
                  patientId && (isPatientIdValid ? styles.inputValid : styles.inputInvalid)
                }`}
              />
              <p className={styles.inputHint}>
                {patientId && !isPatientIdValid
                  ? '⚠️ Must be 3-20 alphanumeric characters'
                  : isPatientIdValid
                  ? '✓ Valid patient ID'
                  : 'Enter alphanumeric ID (3-20 characters)'}
              </p>
            </div>
          </div>

          {/* Step 2: Select Files */}
          <div className={styles.card}>
            <span className={styles.stepBadge}>Step 2</span>
            <h2 className={styles.cardTitle}>Select Files</h2>

            <div
              className={`${styles.uploadZone} ${
                isDragging ? styles.uploadZoneActive : ''
              } ${!isPatientIdValid || isUploading ? styles.uploadZoneDisabled : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (isPatientIdValid && !isUploading) {
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className={styles.uploadIcon}>
                <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className={styles.uploadTitle}>
                {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
              </h3>
              <p className={styles.uploadDescription}>
                {!isPatientIdValid
                  ? 'Enter a valid patient ID first'
                  : 'Upload JPG, PNG, or PDF files (max 5MB each)'}
              </p>
              {isPatientIdValid && !isUploading && (
                <button className={styles.uploadButton}>
                  Choose Files
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileInputChange}
                className={styles.fileInput}
              />
            </div>
          </div>

          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                Selected Files ({selectedFiles.length})
              </h2>
              <ul className={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <div className={styles.fileIcon}>
                      <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className={styles.fileInfo}>
                      <p className={styles.fileName}>{file.name}</p>
                      <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      disabled={isUploading}
                      className={styles.removeButton}
                      aria-label="Remove file"
                    >
                      <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
            </button>
            <button
              onClick={handleReset}
              disabled={isUploading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Sidebar - Guidelines */}
        <div className={styles.sidebar}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Upload Guidelines</h3>

            <div className={styles.guidelineSection}>
              <h4 className={styles.guidelineTitle}>Supported Formats</h4>
              <ul className={styles.checkList}>
                <li>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  JPG, JPEG - Image files
                </li>
                <li>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PNG - Image files
                </li>
                <li>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PDF - Document files
                </li>
              </ul>
            </div>

            <div className={styles.guidelineSection}>
              <h4 className={styles.guidelineTitle}>File Limits</h4>
              <ul className={styles.guidelineList}>
                <li>Maximum file size: 5MB per file</li>
                <li>Maximum files per upload: 10 files</li>
                <li>Total storage limited by browser</li>
              </ul>
            </div>

            <div className={styles.guidelineSection}>
              <h4 className={styles.guidelineTitle}>File Naming</h4>
              <p className={styles.guidelineText}>
                Files are automatically renamed using the format:
              </p>
              <div className={styles.codeBlock}>
                [PATIENT_ID]_[DATE]_[SEQUENCE].[ext]
              </div>
            </div>

            <div className={styles.guidelineSection}>
              <h4 className={styles.guidelineTitle}>Storage Location</h4>
              <p className={styles.guidelineText}>
                Files are stored securely in your browser's local storage with associated patient metadata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
