import React from 'react';
import { ClaimsList } from './components/ClaimsList';

export function ClaimsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Claims Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage FNOL intake, adjusters, reserves, and payouts
        </p>
      </div>
      <ClaimsList />
    </div>
  );
}