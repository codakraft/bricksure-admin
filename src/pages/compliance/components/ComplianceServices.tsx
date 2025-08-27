import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, UserCheck, FileText, Search, Filter } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useNotifications } from '../../../contexts/NotificationContext';
import { MakerCheckerModal } from '../../../components/common/MakerCheckerModal';

const kycChecks = [
  {
    id: 'KYC-001',
    userId: 'user-123',
    userName: 'John Smith',
    userEmail: 'john.smith@email.com',
    checkType: 'Identity Verification',
    status: 'pending',
    flagReason: 'Document quality issues',
    submittedAt: '2025-01-27T10:30:00Z',
    riskLevel: 'medium'
  },
  {
    id: 'KYC-002',
    userId: 'user-456',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@email.com',
    checkType: 'Address Verification',
    status: 'failed',
    flagReason: 'Address mismatch with utility bill',
    submittedAt: '2025-01-26T14:20:00Z',
    riskLevel: 'high'
  },
  {
    id: 'KYC-003',
    userId: 'user-789',
    userName: 'Michael Brown',
    userEmail: 'michael.brown@email.com',
    checkType: 'PEP Screening',
    status: 'flagged',
    flagReason: 'Potential PEP match found',
    submittedAt: '2025-01-25T16:45:00Z',
    riskLevel: 'critical'
  }
];

const amlAlerts = [
  {
    id: 'AML-001',
    userId: 'user-321',
    userName: 'Sarah Wilson',
    userEmail: 'sarah.wilson@email.com',
    alertType: 'Suspicious Transaction Pattern',
    description: 'Multiple high-value transactions in short timeframe',
    amount: '₦2,500,000',
    triggeredAt: '2025-01-27T08:15:00Z',
    status: 'investigating',
    riskScore: 85
  },
  {
    id: 'AML-002',
    userId: 'user-654',
    userName: 'David Johnson',
    userEmail: 'david.johnson@email.com',
    alertType: 'Unusual Geographic Activity',
    description: 'Transactions from multiple high-risk jurisdictions',
    amount: '₦750,000',
    triggeredAt: '2025-01-26T12:30:00Z',
    status: 'pending',
    riskScore: 72
  }
];

const complianceServices = [
  {
    id: 'kyc-verification',
    name: 'KYC Verification',
    description: 'Identity and address verification services',
    status: 'active',
    provider: 'Smile Identity',
    lastCheck: '2025-01-27T10:00:00Z',
    successRate: '94.2%'
  },
  {
    id: 'aml-screening',
    name: 'AML Screening',
    description: 'Anti-money laundering transaction monitoring',
    status: 'active',
    provider: 'Chainalysis',
    lastCheck: '2025-01-27T09:45:00Z',
    successRate: '98.7%'
  },
  {
    id: 'pep-screening',
    name: 'PEP Screening',
    description: 'Politically exposed persons screening',
    status: 'active',
    provider: 'World-Check',
    lastCheck: '2025-01-27T09:30:00Z',
    successRate: '99.1%'
  },
  {
    id: 'sanctions-screening',
    name: 'Sanctions Screening',
    description: 'Global sanctions list screening',
    status: 'maintenance',
    provider: 'OFAC',
    lastCheck: '2025-01-26T23:00:00Z',
    successRate: '99.8%'
  }
];

export function ComplianceServices() {
  const [activeTab, setActiveTab] = useState('kyc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMakerChecker, setShowMakerChecker] = useState(false);
  const [pendingAction, setPendingAction] = useState<{action: string, data: any} | null>(null);
  const { addNotification } = useNotifications();

  const handleKycOverride = (kycId: string, action: 'approve' | 'reject') => {
    const kyc = kycChecks.find(k => k.id === kycId);
    if (!kyc) return;

    setPendingAction({
      action: `KYC ${action === 'approve' ? 'Override Approval' : 'Rejection'}`,
      data: {
        kycId,
        userName: kyc.userName,
        checkType: kyc.checkType,
        action
      }
    });
    setShowMakerChecker(true);
  };

  const handleAmlAction = (amlId: string, action: 'clear' | 'escalate') => {
    const aml = amlAlerts.find(a => a.id === amlId);
    if (!aml) return;

    setPendingAction({
      action: `AML Alert ${action === 'clear' ? 'Clearance' : 'Escalation'}`,
      data: {
        amlId,
        userName: aml.userName,
        alertType: aml.alertType,
        action
      }
    });
    setShowMakerChecker(true);
  };

  const handleMakerCheckerSubmit = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addNotification({
        type: 'success',
        title: 'Compliance Action Submitted',
        message: `${pendingAction?.action} has been submitted for approval.`
      });
      
      setPendingAction(null);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to submit compliance action.'
      });
    }
  };

  const filteredKyc = kycChecks.filter(kyc => {
    const matchesSearch = kyc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || kyc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAml = amlAlerts.filter(aml => {
    const matchesSearch = aml.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aml.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || aml.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance Services</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage KYC, AML, PEP screening and compliance overrides
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceServices.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                service.status === 'active' 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {service.status.toUpperCase()}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{service.description}</p>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              <p>Provider: {service.provider}</p>
              <p>Success Rate: {service.successRate}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'kyc', label: 'KYC Checks' },
              { key: 'aml', label: 'AML Alerts' },
              { key: 'reports', label: 'Compliance Reports' }
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="flagged">Flagged</option>
                <option value="investigating">Investigating</option>
              </select>
              <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                More Filters
              </Button>
            </div>
          </div>

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              {filteredKyc.map((kyc) => (
                <div key={kyc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      kyc.riskLevel === 'critical' ? 'bg-red-500' :
                      kyc.riskLevel === 'high' ? 'bg-orange-500' :
                      kyc.riskLevel === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{kyc.userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{kyc.userEmail}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{kyc.checkType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <StatusBadge status={kyc.status as any} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{kyc.flagReason}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Review
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => handleKycOverride(kyc.id, 'approve')}
                      >
                        Override
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'aml' && (
            <div className="space-y-4">
              {filteredAml.map((aml) => (
                <div key={aml.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      aml.riskScore >= 80 ? 'bg-red-500' :
                      aml.riskScore >= 60 ? 'bg-orange-500' :
                      aml.riskScore >= 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{aml.userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{aml.alertType}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{aml.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{aml.amount}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Risk Score: {aml.riskScore}</p>
                      <StatusBadge status={aml.status as any} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => handleAmlAction(aml.id, 'clear')}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<AlertTriangle className="w-4 h-4" />}
                        onClick={() => handleAmlAction(aml.id, 'escalate')}
                      >
                        Escalate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'KYC Compliance Summary', description: 'Monthly KYC verification summary', format: 'PDF' },
                  { name: 'AML Activity Report', description: 'Anti-money laundering monitoring report', format: 'CSV' },
                  { name: 'PEP Screening Results', description: 'Politically exposed persons screening', format: 'XLSX' },
                  { name: 'Sanctions Screening Log', description: 'Global sanctions list screening results', format: 'JSON' },
                  { name: 'Regulatory Filing', description: 'Regulator-ready compliance data export', format: 'XML' },
                  { name: 'Override Audit Trail', description: 'Complete audit of compliance overrides', format: 'PDF' }
                ].map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{report.format}</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={<FileText className="w-4 h-4" />}>
                      Generate
                    </Button>
                  </div>
                ))}
              </div>
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
          entityType="Compliance"
          entityId={pendingAction.data.kycId || pendingAction.data.amlId}
          data={pendingAction.data}
          riskLevel="critical"
          onSubmit={handleMakerCheckerSubmit}
        />
      )}
    </div>
  );
}