import React, { useState } from 'react';
import { Award, Plus, Download, QrCode, Search, Eye, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

const certificateStats = [
  {
    name: 'Total Certificates',
    value: '2,847',
    change: '+124',
    icon: Award
  },
  {
    name: 'Issued This Month',
    value: '124',
    change: '+15%',
    icon: Plus
  },
  {
    name: 'Pending Generation',
    value: '8',
    change: '-2',
    icon: Download
  },
  {
    name: 'Reissued',
    value: '23',
    change: '+3',
    icon: RotateCcw
  }
];

const certificates = [
  {
    id: 'CERT-2025-001',
    serial: 'BS-001-2025-4A7B',
    policyId: 'POL-2024-001',
    customerName: 'John Smith',
    propertyAddress: '123 Victoria Street, Lagos',
    issueDate: '2025-01-15T10:30:00Z',
    expiryDate: '2025-12-15T23:59:59Z',
    status: 'active',
    version: 'v1.0',
    qrVerified: true
  },
  {
    id: 'CERT-2025-002',
    serial: 'BS-002-2025-8C3D',
    policyId: 'POL-2024-002',
    customerName: 'ABC Construction Ltd',
    propertyAddress: '45 Allen Avenue, Ikeja, Lagos',
    issueDate: '2025-01-20T14:20:00Z',
    expiryDate: '2026-01-20T23:59:59Z',
    status: 'active',
    version: 'v1.0',
    qrVerified: true
  }
];
import { Link } from 'react-router-dom';

export function CertificateOverview() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Factory</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate, manage, and verify insurance certificates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {certificateStats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'certificates', label: 'Certificates' },
              { key: 'templates', label: 'Templates' },
              { key: 'verification', label: 'Verification' }
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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificate Management</h3>
                <div className="flex items-center space-x-2">
                  <Link to="/certificates/issue">
                    <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>
                      Issue Certificates
                    </Button>
                  </Link>
                  <Button icon={<Download className="w-4 h-4" />}>
                    Bulk Export
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/certificates/issue">
                  <Button className="justify-start h-auto p-4 w-full" variant="secondary">
                    <div className="text-left">
                      <p className="font-medium">Issue New Certificate</p>
                      <p className="text-sm text-gray-500 mt-1">Generate certificate for approved policy</p>
                    </div>
                  </Button>
                </Link>
                <Button className="justify-start h-auto p-4" variant="secondary">
                  <div className="text-left">
                    <p className="font-medium">Reissue Certificate</p>
                    <p className="text-sm text-gray-500 mt-1">Replace existing certificate</p>
                  </div>
                </Button>
                <Button className="justify-start h-auto p-4" variant="secondary">
                  <div className="text-left">
                    <p className="font-medium">Verify Certificate</p>
                    <p className="text-sm text-gray-500 mt-1">Check certificate validity</p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Certificates</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search certificates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                  <Button variant="secondary" size="sm" icon={<Plus className="w-4 h-4" />}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Certificate ID</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Serial Number</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Customer</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Property</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Issue Date</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">QR Status</th>
                      <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{cert.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{cert.version}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {cert.serial}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-gray-900 dark:text-white">{cert.customerName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{cert.policyId}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={cert.propertyAddress}>
                            {cert.propertyAddress}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={cert.status as any} />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <QrCode className={`w-4 h-4 mr-2 ${cert.qrVerified ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`text-sm ${cert.qrVerified ? 'text-green-600' : 'text-gray-400'}`}>
                              {cert.qrVerified ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                              View
                            </Button>
                            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" icon={<RotateCcw className="w-4 h-4" />}>
                              Reissue
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificate Verification</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificate Serial Number
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="BS-001-2025-4A7B"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                    />
                    <Button>Verify</Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Enter the certificate serial number to verify its authenticity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <QrCode className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">QR Code Verification</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Scan QR codes to instantly verify certificates
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="secondary">
                      Launch QR Scanner
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-800">Public Verification</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Public verification page for third-party validation
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="secondary">
                      View Public Page
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}