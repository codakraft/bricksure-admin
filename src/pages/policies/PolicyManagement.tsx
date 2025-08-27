import React from 'react';
import { PoliciesList } from './components/PoliciesList';

export function PolicyManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Policy Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage policy lifecycle, underwriting, and approvals
        </p>
      </div>
      <PoliciesList />
    </div>
  );
}