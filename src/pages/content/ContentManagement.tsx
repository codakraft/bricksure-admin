import React from 'react';
import { ContentOverview } from './components/ContentOverview';

export function ContentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage FAQs, coverage content, community insights, and campaigns
        </p>
      </div>
      <ContentOverview />
    </div>
  );
}