import React from 'react';
import { Clock, User, FileText, Shield, DollarSign } from 'lucide-react';

const activities = [
  {
    id: '1',
    type: 'user_created',
    description: 'New user registration: John Smith',
    user: 'System',
    timestamp: '2 minutes ago',
    icon: User,
    color: 'blue'
  },
  {
    id: '2',
    type: 'policy_approved',
    description: 'Policy POL-2024-001 approved by underwriter',
    user: 'Sarah Johnson',
    timestamp: '5 minutes ago',
    icon: FileText,
    color: 'green'
  },
  {
    id: '3',
    type: 'compliance_alert',
    description: 'KYC verification failed for user ID 12543',
    user: 'Compliance System',
    timestamp: '15 minutes ago',
    icon: Shield,
    color: 'red'
  },
  {
    id: '4',
    type: 'payment_received',
    description: 'Premium payment of ₦45,000 received',
    user: 'Payment Gateway',
    timestamp: '1 hour ago',
    icon: DollarSign,
    color: 'indigo'
  }
];

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  indigo: 'bg-indigo-100 text-indigo-600'
};

export function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorMap[activity.color as keyof typeof colorMap]}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>by {activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}