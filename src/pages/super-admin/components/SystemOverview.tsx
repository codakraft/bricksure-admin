import React from 'react';
import { Shield, Users, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../../components/common/Button';

const systemStats = [
  {
    name: 'Active Admin Users',
    value: '28',
    change: '+3',
    icon: Users,
    color: 'blue'
  },
  {
    name: 'Custom Roles',
    value: '12',
    change: '+2',
    icon: Shield,
    color: 'green'
  },
  {
    name: 'Pending Approvals',
    value: '7',
    change: '+1',
    icon: Clock,
    color: 'yellow'
  },
  {
    name: 'System Health',
    value: '99.9%',
    change: '0%',
    icon: CheckCircle,
    color: 'green'
  }
];

const recentActivity = [
  {
    id: '1',
    action: 'Role Created',
    details: 'New "Regional Manager" role created',
    user: 'Super Admin',
    timestamp: '2025-01-27T10:30:00Z',
    type: 'success'
  },
  {
    id: '2',
    action: 'High-Risk Approval',
    details: 'Policy cancellation approved for POL-2024-001',
    user: 'Compliance Officer',
    timestamp: '2025-01-27T09:15:00Z',
    type: 'warning'
  },
  {
    id: '3',
    action: 'User Suspended',
    details: 'Admin user john.doe@bricksure.com suspended',
    user: 'Super Admin',
    timestamp: '2025-01-26T16:45:00Z',
    type: 'error'
  }
];

export function SystemOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          System-wide administration and oversight
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                {stat.change} this month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="justify-start h-auto p-4" variant="secondary">
            <div className="text-left">
              <p className="font-medium">Manage Roles</p>
              <p className="text-sm text-gray-500 mt-1">Create and configure user roles</p>
            </div>
          </Button>
          <Button className="justify-start h-auto p-4" variant="secondary">
            <div className="text-left">
              <p className="font-medium">Review Approvals</p>
              <p className="text-sm text-gray-500 mt-1">Process maker-checker requests</p>
            </div>
          </Button>
          <Button className="justify-start h-auto p-4" variant="secondary">
            <div className="text-left">
              <p className="font-medium">System Settings</p>
              <p className="text-sm text-gray-500 mt-1">Configure system parameters</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.details}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>by {activity.user}</span>
                  <span>•</span>
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}