import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Users, DollarSign, Shield, Award } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const actions = [
  {
    name: 'Create User',
    description: 'Add a new admin or customer',
    icon: Plus,
    color: 'blue',
    permission: 'users.write',
    href: '/users/create'
  },
  {
    name: 'Review Policies',
    description: 'Pending underwriting decisions',
    icon: FileText,
    color: 'green',
    permission: 'policies.approve',
    href: '/policies?status=underwriting'
  },
  {
    name: 'User Management',
    description: 'Manage customer accounts',
    icon: Users,
    color: 'indigo',
    permission: 'users.read',
    href: '/users'
  },
  {
    name: 'Financial Reports',
    description: 'Generate wallet statements',
    icon: DollarSign,
    color: 'orange',
    permission: 'wallet.read',
    href: '/finance/reports'
  },
  {
    name: 'Compliance Dashboard',
    description: 'Review KYC and AML alerts',
    icon: Shield,
    color: 'red',
    permission: 'compliance.read',
    href: '/compliance'
  },
  {
    name: 'Issue Certificates',
    description: 'Generate policy certificates',
    icon: Award,
    color: 'purple',
    permission: 'certificates.issue',
    href: '/certificates'
  }
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
  orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
};

export function QuickActions() {
  const { hasPermission } = useAuth();

  const visibleActions = actions.filter(action => hasPermission(action.permission));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleActions.map((action) => (
            <Link
              to={action.href}
              key={action.name}
              className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors text-left"
            >
              <div className={`p-2 rounded-lg mr-4 ${colorMap[action.color as keyof typeof colorMap]}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}