'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: string;
}

interface Patient {
  id: string;
  files: number;
  size: string;
  sizeBytes: number;
  filesList: FileRecord[];
}

export default function NewStoragePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageTotal] = useState(5.0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPatients = patients.length;
  const totalFiles = patients.reduce((sum, p) => sum + p.files, 0);
  const usagePercentage = (storageUsed / storageTotal) * 100;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const loadPatientsData = () => {
    try {
      const patientsData = JSON.parse(localStorage.getItem('patients') || '{}');
      const patientsList: Patient[] = [];
      let totalSize = 0;

      Object.keys(patientsData).forEach((patientId) => {
        const patient = patientsData[patientId];
        const patientSize = patient.files.reduce((sum: number, file: any) => sum + file.size, 0);
        totalSize += patientSize;

        patientsList.push({
          id: patientId,
          files: patient.files.length,
          size: formatFileSize(patientSize),
          sizeBytes: patientSize,
          filesList: patient.files
        });
      });

      setPatients(patientsList);
      setStorageUsed(totalSize / (1024 * 1024)); // Convert to MB
    } catch (error) {
      console.error('Error loading patients data:', error);
      setPatients([]);
    }
  };

  useEffect(() => {
    loadPatientsData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadPatientsData();
      setIsRefreshing(false);
      alert('Storage information refreshed!');
    }, 1000);
  };

  const handleExport = () => {
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
      alert('Data exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
      console.error(error);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm(`Delete patient ${patientId} and all their files? This cannot be undone.`)) {
      try {
        const patientsData = JSON.parse(localStorage.getItem('patients') || '{}');
        delete patientsData[patientId];
        localStorage.setItem('patients', JSON.stringify(patientsData));
        loadPatientsData();
        alert(`Patient ${patientId} deleted successfully`);
      } catch (error) {
        alert('Error deleting patient. Please try again.');
        console.error(error);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        localStorage.removeItem('patients');
        loadPatientsData();
        alert('All data cleared!');
      } catch (error) {
        alert('Error clearing data. Please try again.');
        console.error(error);
      }
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const importedData = JSON.parse(event.target.result);
            localStorage.setItem('patients', JSON.stringify(importedData));
            loadPatientsData();
            alert('Data imported successfully!');
          } catch (error) {
            alert('Error importing data. Please make sure the file is valid.');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getMeterClass = () => {
    if (usagePercentage >= 95) return styles.danger;
    if (usagePercentage >= 80) return styles.warning;
    return '';
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPatient(null), 300);
  };

  const handleDownloadFile = (file: FileRecord) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const handleDownloadAll = () => {
    if (!selectedPatient) return;

    selectedPatient.filesList.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
      }, index * 300); // Delay each download by 300ms to avoid browser blocking
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Storage Management</h1>
          <p className={styles.subtitle}>
            Monitor and manage your patient photo storage
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={styles.refreshButton}
          >
            <svg
              className={`${styles.icon} ${isRefreshing ? styles.iconSpin : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button onClick={handleExport} className={styles.exportButton}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {/* Total Patients */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Total Patients</p>
              <p className={styles.statValue}>{totalPatients}</p>
            </div>
            <div className={`${styles.iconCircle} ${styles.blue}`}>
              <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
            <div className={`${styles.iconCircle} ${styles.purple}`}>
              <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Data Size */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Data Size</p>
              <p className={styles.statValue}>{storageUsed.toFixed(2)} MB</p>
            </div>
            <div className={`${styles.iconCircle} ${styles.green}`}>
              <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Storage Used */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statCardContent}>
              <p className={styles.statLabel}>Storage Used</p>
              <p className={styles.statValue}>{usagePercentage.toFixed(1)}%</p>
            </div>
            <div className={`${styles.iconCircle} ${styles.orange}`}>
              <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Meter */}
      <div className={styles.storageMeterCard}>
        <h2 className={styles.meterTitle}>Storage Usage</h2>
        <div className={styles.meterBar}>
          <div
            className={`${styles.meterFill} ${getMeterClass()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <div className={styles.meterInfo}>
          <span>{storageUsed.toFixed(2)} MB used</span>
          <span>{storageTotal.toFixed(2)} MB total</span>
        </div>
      </div>

      {/* Browser Storage Info */}
      <div className={styles.infoCard}>
        <div className={styles.infoContent}>
          <svg className={`${styles.infoIcon} ${styles.blue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <div className={styles.infoText}>
            <p className={styles.infoTitle}>Browser Storage Information</p>
            <p className={styles.infoDescription}>
              Your browser reports <strong>{storageUsed.toFixed(2)} MB</strong> used out of{' '}
              <strong>{storageTotal.toFixed(2)} MB</strong> total storage quota. Patient data is stored in localStorage.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Patient Statistics */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Patient Data</h3>
          {patients.length > 0 ? (
            <ul className={styles.patientList}>
              {patients.map((patient) => (
                <li key={patient.id} className={styles.patientItem}>
                  <div
                    className={styles.patientInfo}
                    onClick={() => handleViewPatient(patient)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <p className={styles.patientId}>{patient.id}</p>
                      <p className={styles.patientStats}>
                        {patient.files} files • {patient.size}
                      </p>
                    </div>
                    <div className={styles.imagePreview}>
                      {patient.filesList.slice(0, 3).map((file, index) => (
                        <div key={file.id} className={styles.previewItem}>
                          {file.type.startsWith('image/') ? (
                            <img src={file.data} alt={file.name} className={styles.thumbnail} />
                          ) : (
                            <div className={styles.pdfIcon}>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                      {patient.files > 3 && (
                        <div className={styles.moreFiles}>
                          +{patient.files - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(patient.id);
                    }}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <svg className={styles.iconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className={styles.emptyStateText}>No patient data yet</p>
            </div>
          )}
        </div>

        {/* Cleanup Tools & Tips */}
        <div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Cleanup Tools</h3>
            <div className={styles.toolsSection}>
              <button onClick={handleImport} className={styles.toolButton}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Data
              </button>
              <button onClick={handleClearAll} className={`${styles.toolButton} ${styles.danger}`}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Data
              </button>
            </div>
          </div>

          <div className={styles.card} style={{ marginTop: '24px' }}>
            <h3 className={styles.cardTitle}>Storage Tips</h3>
            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                <svg className={`${styles.tipIcon} ${styles.green}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <p className={styles.tipText}>
                  Regularly export your data to keep backups of patient photos
                </p>
              </li>
              <li className={styles.tipItem}>
                <svg className={`${styles.tipIcon} ${styles.blue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <p className={styles.tipText}>
                  Browser storage has a limit of 5-10MB depending on your browser
                </p>
              </li>
              <li className={styles.tipItem}>
                <svg className={`${styles.tipIcon} ${styles.orange}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className={styles.tipText}>
                  Delete old patient data when no longer needed to free up space
                </p>
              </li>
              <li className={styles.tipItem}>
                <svg className={`${styles.tipIcon} ${styles.purple}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className={styles.tipText}>
                  Import previously exported backups to restore patient data
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && selectedPatient && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Patient Files - {selectedPatient.id}</h2>
                <p className={styles.modalSubtitle}>
                  {selectedPatient.files} files • {selectedPatient.size}
                </p>
              </div>
              <div className={styles.modalActions}>
                <button onClick={handleDownloadAll} className={styles.downloadAllButton}>
                  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All
                </button>
                <button onClick={handleCloseModal} className={styles.closeButton}>
                  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {selectedPatient.filesList.map((file) => (
                <div key={file.id} className={styles.fileCard}>
                  <div className={styles.filePreview}>
                    {file.type.startsWith('image/') ? (
                      <img src={file.data} alt={file.name} className={styles.fileImage} />
                    ) : (
                      <div className={styles.filePdfPreview}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p>PDF Document</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.fileDetails}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                    <p className={styles.fileDate}>
                      Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className={styles.downloadButton}
                    >
                      <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
