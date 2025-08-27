import React from 'react';
import { Users, FileText, DollarSign, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

const stats = [
  {
    name: 'Total Users',
    value: '12,543',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'blue'
  },
  {
    name: 'Active Policies',
    value: '8,921',
    change: '+8%',
    changeType: 'increase' as const,
    icon: FileText,
    color: 'green'
  },
  {
    name: 'Premium Collected',
    value: '₦2.4M',
    change: '+15%',
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'indigo'
  },
  {
    name: 'Conversion Rate',
    value: '68.5%',
    change: '-2%',
    changeType: 'decrease' as const,
    icon: TrendingUp,
    color: 'orange'
  },
  {
    name: 'Claims Ratio',
    value: '12.3%',
    change: '+1%',
    changeType: 'increase' as const,
    icon: Shield,
    color: 'red'
  },
  {
    name: 'Pending Reviews',
    value: '47',
    change: '-5%',
    changeType: 'decrease' as const,
    icon: AlertTriangle,
    color: 'yellow'
  }
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-yellow-50 text-yellow-600'
};

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}