import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Key, UserX, UserCheck, Mail, Phone } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

export function UserDetail() {
  const { id } = useParams();

  // Mock user data
  const user = {
    id: id,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+234 801 234 5678',
    role: 'Customer',
    status: 'active' as const,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2025-01-27T10:30:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    department: 'N/A',
    mfaEnabled: true,
    address: {
      street: '123 Victoria Street',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria'
    },
    policies: [
      {
        id: 'POL-2024-001',
        property: '123 Victoria Street, Lagos',
        premium: '₦45,000',
        status: 'active' as const
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/users">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Details</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage user account and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" icon={<Key className="w-4 h-4" />}>
            Reset Password
          </Button>
          <Button variant="secondary" icon={<Mail className="w-4 h-4" />}>
            Send Email
          </Button>
          {user.status === 'active' ? (
            <Button variant="danger" icon={<UserX className="w-4 h-4" />}>
              Suspend
            </Button>
          ) : (
            <Button icon={<UserCheck className="w-4 h-4" />}>
              Activate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <div className="mt-2">
                <StatusBadge status={user.status} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <p className="text-gray-900 dark:text-white">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <p className="text-gray-900 dark:text-white">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                <p className="text-gray-900 dark:text-white">{user.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">MFA Status</label>
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${user.mfaEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-gray-900 dark:text-white">
                    {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                <p className="text-gray-900 dark:text-white">{user.address.street}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <p className="text-gray-900 dark:text-white">{user.address.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                <p className="text-gray-900 dark:text-white">{user.address.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                <p className="text-gray-900 dark:text-white">{user.address.country}</p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Policies</h3>
            <div className="space-y-4">
              {user.policies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{policy.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{policy.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{policy.premium}</p>
                    <StatusBadge status={policy.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}