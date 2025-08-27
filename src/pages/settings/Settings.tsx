import React from 'react';
import { SettingsOverview } from './components/SettingsOverview';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage system settings, feature flags, and configurations
        </p>
      </div>
      <SettingsOverview />
    </div>
  );
}