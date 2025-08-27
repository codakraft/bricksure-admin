import React from 'react';
import { PropertiesList } from './components/PropertiesList';

export function PropertyManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Property Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage property records, media, and metadata
        </p>
      </div>
      <PropertiesList />
    </div>
  );
}