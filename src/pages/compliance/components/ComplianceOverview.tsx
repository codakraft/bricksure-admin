import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Download, Search, Eye } from 'lucide-react';
import { Button } from '../../../components/common/Button';

const complianceStats = [
  {
    name: 'KYC Pending',
    value: '23',
    status: 'warning',
    icon: Shield
  },
  {
    name: 'AML Flags',
    value: '5',
    status: 'critical',
    icon: AlertTriangle
  },
  {
    name: 'PEP Matches',
    value: '2',
    status: 'critical',
    icon: AlertTriangle
  },
  {
    name: 'Completed Reviews',
    value: '1,247',
    status: 'good',
    icon: CheckCircle
  }
];

const auditLogs = [
  {
    id: 'AUD-001',
    action: 'KYC Override',
    user: 'Compliance Officer',
    entity: 'User ID 12543',
    timestamp: '2025-01-27T10:30:00Z',
    reason: 'Manual verification completed',
    riskLevel: 'medium'
  },
  {
    id: 'AUD-002',
    action: 'Policy Approval',
    user: 'Underwriter',
    entity: 'POL-2024-001',
    timestamp: '2025-01-27T09:15:00Z',
    reason: 'Standard approval process',
    riskLevel: 'low'
  },
  {
    id: 'AUD-003',
    action: 'AML Flag Override',
    user: 'Super Admin',
    entity: 'User ID 12544',
    timestamp: '2025-01-26T16:45:00Z',
    reason: 'False positive confirmed',
    riskLevel: 'high'
  }
];

const statusColors = {
  good: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};
import { Link } from 'react-router-dom';

export function ComplianceOverview() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance & Audit</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor KYC/AML/PEP checks, manage overrides, and export audit logs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {complianceStats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.status === 'good' ? 'bg-green-50 text-green-600' :
                stat.status === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[stat.status as keyof typeof statusColors]}`}>
                {stat.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'kyc', label: 'KYC/AML' },
              { key: 'audit', label: 'Audit Logs' },
              { key: 'reports', label: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Pending Reviews</h4>
                        <p className="text-sm text-yellow-700 mt-1">28 items require attention</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to="/compliance/services">
                        <Button size="sm" variant="secondary">Review Items</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-green-800">System Health</h4>
                        <p className="text-sm text-green-700 mt-1">All compliance checks active</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link to="/compliance/services">
                        <Button size="sm" variant="secondary">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Trail</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.riskLevel === 'high' ? 'bg-red-500' :
                          log.riskLevel === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {log.entity} by {log.user}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                          Details
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Reason: {log.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'KYC Compliance Report', description: 'Monthly KYC verification summary', format: 'PDF' },
                  { name: 'AML Activity Report', description: 'Anti-money laundering monitoring', format: 'CSV' },
                  { name: 'Audit Trail Export', description: 'Complete audit log export', format: 'JSON' },
                  { name: 'Regulatory Filing', description: 'Regulator-ready compliance data', format: 'XLSX' }
                ].map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{report.format}</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                      Generate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}