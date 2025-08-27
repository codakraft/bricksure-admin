import React, { useState } from 'react';
import { Search, Filter, FileText, Eye, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface Policy {
  id: string;
  customerName: string;
  propertyAddress: string;
  premium: string;
  sumInsured: string;
  status: string;
  submittedDate: string;
  expiryDate: string;
  underwriter?: string;
}

const mockPolicies: Policy[] = [
  {
    id: 'POL-2024-001',
    customerName: 'John Smith',
    propertyAddress: '123 Victoria Street, Lagos',
    premium: '₦45,000',
    sumInsured: '₦50,000,000',
    status: 'active',
    submittedDate: '2024-12-15T10:30:00Z',
    expiryDate: '2025-12-15T23:59:59Z',
    underwriter: 'Sarah Johnson'
  },
  {
    id: 'POL-2024-002',
    customerName: 'ABC Construction Ltd',
    propertyAddress: '45 Allen Avenue, Ikeja, Lagos',
    premium: '₦120,000',
    sumInsured: '₦120,000,000',
    status: 'underwriting',
    submittedDate: '2025-01-25T14:20:00Z',
    expiryDate: '2026-01-25T23:59:59Z'
  },
  {
    id: 'POL-2024-003',
    customerName: 'Jane Doe',
    propertyAddress: '78 Admiralty Way, Lekki, Lagos',
    premium: '₦38,000',
    sumInsured: '₦35,000,000',
    status: 'expired',
    submittedDate: '2024-01-10T09:15:00Z',
    expiryDate: '2025-01-10T23:59:59Z',
    underwriter: 'Michael Brown'
  }
];

export function PoliciesList() {
  const [policies] = useState<Policy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,156</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">68</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="underwriting">Underwriting</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Policy ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Property</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Premium</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Sum Insured</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Expiry Date</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{policy.id}</p>
                      {policy.underwriter && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          UW: {policy.underwriter}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{policy.customerName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={policy.propertyAddress}>
                      {policy.propertyAddress}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {policy.premium}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {policy.sumInsured}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={policy.status as any} />
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(policy.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                      {policy.status === 'active' && (
                        <Button variant="ghost" size="sm" icon={<Award className="w-4 h-4" />}>
                          Certificate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}