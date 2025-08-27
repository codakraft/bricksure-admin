import React from 'react';
import { Server, Database, Wifi, Shield } from 'lucide-react';

const healthMetrics = [
  {
    name: 'API Response Time',
    value: '245ms',
    status: 'good',
    icon: Server
  },
  {
    name: 'Database Performance',
    value: '99.9%',
    status: 'good',
    icon: Database
  },
  {
    name: 'Network Latency',
    value: '12ms',
    status: 'excellent',
    icon: Wifi
  },
  {
    name: 'Security Score',
    value: '98/100',
    status: 'good',
    icon: Shield
  }
];

const statusColors = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
};

export function SystemHealth() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthMetrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <metric.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusColors[metric.status as keyof typeof statusColors]}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}