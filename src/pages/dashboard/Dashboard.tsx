import React from 'react';
import { DashboardStats } from './components/DashboardStats';
import { RecentActivity } from './components/RecentActivity';
import { QuickActions } from './components/QuickActions';
import { SystemHealth } from './components/SystemHealth';
import { RoleBasedWidgets } from './components/RoleBasedWidgets';

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to the BrickSure Admin Console. Here's an overview of your system.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Role-based Widgets */}
      <RoleBasedWidgets />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* System Health */}
      <SystemHealth />
    </div>
  );
}