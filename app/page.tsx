'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function NewDashboard() {
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalSize, setTotalSize] = useState('0 B');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  useEffect(() => {
    // Load data from localStorage
    try {
      const patientsData = JSON.parse(localStorage.getItem('patients') || '{}');
      const patientIds = Object.keys(patientsData);

      let filesCount = 0;
      let totalBytes = 0;

      patientIds.forEach((patientId) => {
        const patient = patientsData[patientId];
        filesCount += patient.files.length;
        patient.files.forEach((file: any) => {
          totalBytes += file.size;
        });
      });

      setTotalPatients(patientIds.length);
      setTotalFiles(filesCount);
      setTotalSize(formatFileSize(totalBytes));
      setStorageUsed((totalBytes / (5 * 1024 * 1024)) * 100); // Percentage of 5MB
    } catch (error) {
      console.error('Error loading data:', error);
      setStorageUsed(0);
      setTotalPatients(0);
      setTotalFiles(0);
      setTotalSize('0 B');
    }
  }, []);

  const getProgressClass = () => {
    if (storageUsed >= 95) return styles.danger;
    if (storageUsed >= 80) return styles.warning;
    return '';
  };

  const handleExportAll = () => {
    try {
      const patientsData = localStorage.getItem('patients') || '{}';
      const dataStr = JSON.stringify(JSON.parse(patientsData), null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ipms_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Comprehensive Patient Photo Management System — View, organize, and manage patient photos with ease
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {/* Total Patients */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Total Patients</p>
              <p className={styles.statValue}>{totalPatients}</p>
              <p className={styles.statDescription}>
                {totalPatients} patient{totalPatients !== 1 ? 's' : ''}
              </p>
            </div>
            <div className={`${styles.iconCircle} ${styles.blue}`}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Files */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Total Files</p>
              <p className={styles.statValue}>{totalFiles}</p>
              <p className={styles.statDescription}>
                {totalFiles} file{totalFiles !== 1 ? 's' : ''}
              </p>
            </div>
            <div className={`${styles.iconCircle} ${styles.green}`}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Storage Used */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Storage Used</p>
              <p className={styles.statValue}>{totalSize}</p>
            </div>
            <div className={`${styles.iconCircle} ${styles.purple}`}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressBarTrack}>
              <div
                className={`${styles.progressBarFill} ${getProgressClass()}`}
                style={{ width: `${Math.min(storageUsed, 100)}%` }}
              />
            </div>
            <p className={styles.progressLabel}>
              {storageUsed.toFixed(1)}% of 5.00 MB used
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsGrid}>
        {/* Upload Files */}
        <Link href="/upload-new" className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <div className={styles.actionCardContent}>
              <p className={`${styles.actionLabel} ${styles.blue}`}>Quick Action</p>
              <h2 className={styles.actionTitle}>Upload Files</h2>
              <p className={styles.actionDescription}>Add new patient photos to the system</p>
            </div>
            <div className={`${styles.actionIcon} ${styles.blue}`}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Export Data */}
        <div className={styles.actionCard}>
          <div className={styles.actionCardHeader}>
            <div className={styles.actionCardContent}>
              <p className={`${styles.actionLabel} ${styles.green}`}>Data Backup</p>
              <h2 className={styles.actionTitle}>Export All Data</h2>
              <p className={styles.actionDescription}>Download complete backup as JSON</p>
              <button onClick={handleExportAll} className={styles.actionButton}>Export All Data</button>
            </div>
            <div className={`${styles.actionIcon} ${styles.green}`}>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Section */}
      <div className={styles.patientsSection}>
        <div className={styles.patientsSectionHeader}>
          <div className={styles.patientsSectionTitle}>
            <h2 className={styles.patientsSectionTitleText}>Patients</h2>
            <p className={styles.patientsSectionSubtitle}>Manage and view all patient records</p>
          </div>
          <div className={styles.patientsControls}>
            <input
              type="text"
              placeholder="Search patients..."
              className={styles.searchInput}
            />
            <Link href="/storage-new" className={styles.storageButton}>
              <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Storage
            </Link>
          </div>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className={styles.emptyStateTitle}>No patients yet</h3>
          <p className={styles.emptyStateDescription}>
            Start by uploading files for a patient to see them appear here.
          </p>
          <Link href="/upload-new" className={styles.uploadButton}>
            <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Patient Files
          </Link>
        </div>
      </div>
    </div>
  );
}
