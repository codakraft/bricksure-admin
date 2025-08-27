import React from 'react';
import { AnalyticsOverview } from './components/AnalyticsOverview';

export function AnalyticsPlatform() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Platform</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Interactive dashboards, reports, and business intelligence
        </p>
      </div>
      <AnalyticsOverview />
    </div>
  );
}