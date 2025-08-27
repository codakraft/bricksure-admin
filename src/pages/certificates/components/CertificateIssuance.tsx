import React, { useState } from 'react';
import { Award, Search, Plus, Download, QrCode, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useNotifications } from '../../../contexts/NotificationContext';
import { MakerCheckerModal } from '../../../components/common/MakerCheckerModal';

const approvedPolicies = [
  {
    id: 'POL-2024-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    propertyAddress: '123 Victoria Street, Lagos',
    sumInsured: 50000000,
    premium: 45000,
    approvedAt: '2025-01-27T10:30:00Z',
    certificateStatus: 'pending',
    policyType: 'Comprehensive'
  },
  {
    id: 'POL-2024-002',
    customerName: 'ABC Construction Ltd',
    customerEmail: 'contact@abcconstruction.com',
    propertyAddress: '45 Allen Avenue, Ikeja, Lagos',
    sumInsured: 120000000,
    premium: 85000,
    approvedAt: '2025-01-26T14:20:00Z',
    certificateStatus: 'issued',
    certificateId: 'CERT-2025-001',
    policyType: 'Commercial'
  }
];

const issuedCertificates = [
  {
    id: 'CERT-2025-001',
    serial: 'BS-001-2025-4A7B',
    policyId: 'POL-2024-002',
    customerName: 'ABC Construction Ltd',
    issuedAt: '2025-01-26T15:30:00Z',
    expiryDate: '2026-01-26T23:59:59Z',
    status: 'active',
    qrVerified: true
  }
];

export function CertificateIssuance() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [showMakerChecker, setShowMakerChecker] = useState(false);
  const [pendingAction, setPendingAction] = useState<{action: string, data: any} | null>(null);
  const { addNotification } = useNotifications();

  const handleIssueCertificate = (policyId: string) => {
    const policy = approvedPolicies.find(p => p.id === policyId);
    if (!policy) return;

    setPendingAction({
      action: 'Issue Certificate',
      data: {
        policyId,
        customerName: policy.customerName,
        sumInsured: policy.sumInsured,
        certificateType: 'Standard'
      }
    });
    setShowMakerChecker(true);
  };

  const handleBulkIssuance = () => {
    if (selectedPolicies.length === 0) {
      addNotification({
        type: 'error',
        title: 'No Policies Selected',
        message: 'Please select at least one policy for bulk certificate issuance.'
      });
      return;
    }

    setPendingAction({
      action: 'Bulk Certificate Issuance',
      data: {
        policyIds: selectedPolicies,
        count: selectedPolicies.length
      }
    });
    setShowMakerChecker(true);
  };

  const handleMakerCheckerSubmit = async () => {
    try {
      // Simulate certificate issuance
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        type: 'success',
        title: 'Certificate Issuance Submitted',
        message: `Certificate issuance request has been submitted for approval.`
      });
      
      setSelectedPolicies([]);
      setPendingAction(null);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Issuance Failed',
        message: 'Failed to submit certificate issuance request.'
      });
    }
  };

  const handleDownloadCertificate = (certificateId: string) => {
    addNotification({
      type: 'info',
      title: 'Download Started',
      message: `Certificate ${certificateId} download has started.`
    });
  };

  const filteredPolicies = approvedPolicies.filter(policy =>
    policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCertificates = issuedCertificates.filter(cert =>
    cert.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Issuance</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Issue certificates for approved policies
          </p>
        </div>
        {selectedPolicies.length > 0 && (
          <Button
            onClick={handleBulkIssuance}
            icon={<Award className="w-4 h-4" />}
          >
            Issue {selectedPolicies.length} Certificates
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Issuance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {approvedPolicies.filter(p => p.certificateStatus === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issued Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <QrCode className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">QR Verified</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Download className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pending', label: 'Pending Issuance' },
              { key: 'issued', label: 'Issued Certificates' }
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
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies or certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {activeTab === 'pending' && (
            <div className="space-y-4">
              {filteredPolicies.filter(p => p.certificateStatus === 'pending').map((policy) => (
                <div key={policy.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedPolicies.includes(policy.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolicies([...selectedPolicies, policy.id]);
                        } else {
                          setSelectedPolicies(selectedPolicies.filter(id => id !== policy.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{policy.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{policy.customerName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{policy.propertyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">₦{policy.sumInsured.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{policy.policyType}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Award className="w-4 h-4" />}
                      onClick={() => handleIssueCertificate(policy.id)}
                    >
                      Issue Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'issued' && (
            <div className="space-y-4">
              {filteredCertificates.map((certificate) => (
                <div key={certificate.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{certificate.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{certificate.customerName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{certificate.serial}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <StatusBadge status={certificate.status as any} />
                      <div className="flex items-center mt-1">
                        <QrCode className={`w-3 h-3 mr-1 ${certificate.qrVerified ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-xs ${certificate.qrVerified ? 'text-green-600' : 'text-gray-400'}`}>
                          QR {certificate.qrVerified ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      onClick={() => handleDownloadCertificate(certificate.id)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maker-Checker Modal */}
      {showMakerChecker && pendingAction && (
        <MakerCheckerModal
          isOpen={showMakerChecker}
          onClose={() => setShowMakerChecker(false)}
          action={pendingAction.action}
          entityType="Certificate"
          entityId={pendingAction.data.policyId || 'bulk'}
          data={pendingAction.data}
          riskLevel="high"
          onSubmit={handleMakerCheckerSubmit}
        />
      )}
    </div>
  );
}