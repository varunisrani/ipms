'use client';

import { useEffect, useState } from 'react';
import { PatientCard } from './patient-card';
import { getAllPatients } from '@/lib/storage/file-storage';
import type { Patient } from '@/lib/types';
import { Users } from 'lucide-react';

interface PatientListProps {
  searchQuery?: string;
}

/**
 * Patient list component
 * Displays all patients in a responsive grid
 */
export function PatientList({ searchQuery = '' }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      const allPatients = getAllPatients();

      // Sort by most recently updated
      const sortedPatients = allPatients.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setPatients(sortedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50/50 to-blue-50/30 px-8 py-16 text-center dark:border-zinc-700 dark:from-zinc-900/50 dark:to-blue-950/30">
        <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg dark:from-blue-900/30 dark:to-cyan-900/30">
          <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
          {searchQuery ? 'No patients found' : 'No patients yet'}
        </p>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
          {searchQuery
            ? `No patients match "${searchQuery}". Try a different search.`
            : 'Start by uploading files for a patient to see them appear here.'}
        </p>
        {!searchQuery && (
          <a
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Patient Files
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/50 px-4 py-2 dark:bg-blue-900/20">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {filteredPatients.length}
          </span>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            patient{filteredPatients.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
