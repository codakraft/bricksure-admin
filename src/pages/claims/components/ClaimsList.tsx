import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, DollarSign, User, Calendar } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface Claim {
  id: string;
  policyId: string;
  customerName: string;
  claimType: string;
  reportedAmount: string;
  reserveAmount: string;
  status: string;
  reportedDate: string;
  adjuster?: string;
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-2025-001',
    policyId: 'POL-2024-001',
    customerName: 'John Smith',
    claimType: 'Fire Damage',
    reportedAmount: '₦2,500,000',
    reserveAmount: '₦2,000,000',
    status: 'underwriting',
    reportedDate: '2025-01-25T14:30:00Z',
    adjuster: 'Michael Johnson'
  },
  {
    id: 'CLM-2025-002',
    policyId: 'POL-2024-003',
    customerName: 'Jane Doe',
    claimType: 'Burglary',
    reportedAmount: '₦450,000',
    reserveAmount: '₦400,000',
    status: 'submitted',
    reportedDate: '2025-01-26T10:15:00Z'
  }
];

export function ClaimsList() {
  const [claims] = useState<Claim[]>(mockClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Claims</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Settled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reserves</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₦24.5M</p>
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
              placeholder="Search claims..."
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
              <option value="submitted">Submitted</option>
              <option value="underwriting">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Claim ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Policy</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Reported Amount</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Reserve</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Adjuster</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{claim.id}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(claim.reportedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{claim.customerName}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {claim.policyId}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {claim.claimType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {claim.reportedAmount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {claim.reserveAmount}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={claim.status as any} />
                  </td>
                  <td className="p-4">
                    {claim.adjuster ? (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4 mr-1" />
                        {claim.adjuster}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
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