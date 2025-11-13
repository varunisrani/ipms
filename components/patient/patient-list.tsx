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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
          <Users className="h-8 w-8 text-zinc-400" />
        </div>
        <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {searchQuery ? 'No patients found' : 'No patients yet'}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {searchQuery
            ? `No patients match "${searchQuery}"`
            : 'Upload files for a patient to get started'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
