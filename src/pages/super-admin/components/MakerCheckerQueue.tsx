import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, User, Calendar } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { MakerCheckerRequest } from '../../../types/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';

// Mock data for demonstration
const mockRequests: MakerCheckerRequest[] = [
  {
    id: 'MC-001',
    action: 'Policy Cancellation',
    entityType: 'Policy',
    entityId: 'POL-2024-001',
    requestedBy: 'underwriter-1',
    requestedAt: '2025-01-27T10:30:00Z',
    status: 'pending',
    riskLevel: 'critical',
    data: {
      reason: 'Customer requested cancellation due to property sale',
      refundAmount: '₦45,000'
    }
  },
  {
    id: 'MC-002',
    action: 'User Role Change',
    entityType: 'User',
    entityId: 'user-123',
    requestedBy: 'admin-2',
    requestedAt: '2025-01-27T09:15:00Z',
    status: 'pending',
    riskLevel: 'high',
    data: {
      reason: 'Promotion to senior underwriter',
      fromRole: 'underwriter',
      toRole: 'senior-underwriter'
    }
  },
  {
    id: 'MC-003',
    action: 'Large Refund',
    entityType: 'Transaction',
    entityId: 'TXN-456',
    requestedBy: 'finance-admin-1',
    requestedAt: '2025-01-26T16:45:00Z',
    status: 'approved',
    checkedBy: 'super-admin',
    checkedAt: '2025-01-27T08:30:00Z',
    riskLevel: 'critical',
    data: {
      reason: 'Processing error refund',
      amount: '₦125,000'
    }
  }
];

const riskColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

export function MakerCheckerQueue() {
  const [requests] = useState<MakerCheckerRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<MakerCheckerRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { approveMakerCheckerRequest, rejectMakerCheckerRequest } = useAuth();
  const { addNotification } = useNotifications();

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const handleApprove = async (requestId: string, reason?: string) => {
    const success = await approveMakerCheckerRequest(requestId, reason);
    if (success) {
      addNotification({
        type: 'success',
        title: 'Request Approved',
        message: `Maker-checker request ${requestId} has been approved.`
      });
      setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    const success = await rejectMakerCheckerRequest(requestId, reason);
    if (success) {
      addNotification({
        type: 'info',
        title: 'Request Rejected',
        message: `Maker-checker request ${requestId} has been rejected.`
      });
      setSelectedRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maker-Checker Queue</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and approve high-risk administrative actions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Risk</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.riskLevel === 'critical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Request ID</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Action</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Entity</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Risk Level</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Requested</th>
                <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{request.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{request.action}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{request.entityType}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{request.entityId}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskColors[request.riskLevel]}`}>
                      {request.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900 dark:text-white">
                        <User className="w-3 h-3 mr-1" />
                        {request.requestedBy}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(request.requestedAt).toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => setSelectedRequest(request)}
                      >
                        Review
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<CheckCircle className="w-4 h-4" />}
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<XCircle className="w-4 h-4" />}
                            onClick={() => handleReject(request.id, 'Rejected by admin')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

interface RequestDetailModalProps {
  request: MakerCheckerRequest;
  onClose: () => void;
  onApprove: (requestId: string, reason?: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

function RequestDetailModal({ request, onClose, onApprove, onReject }: RequestDetailModalProps) {
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Request ID</label>
              <p className="font-medium text-gray-900 dark:text-white">{request.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Action</label>
              <p className="font-medium text-gray-900 dark:text-white">{request.action}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Entity Type</label>
              <p className="font-medium text-gray-900 dark:text-white">{request.entityType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Entity ID</label>
              <p className="font-medium text-gray-900 dark:text-white">{request.entityId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskColors[request.riskLevel]}`}>
                {request.riskLevel.toUpperCase()}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
                {request.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Request Data */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Request Details</label>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {JSON.stringify(request.data, null, 2)}
              </pre>
            </div>
          </div>

          {/* Approval/Rejection Forms */}
          {request.status === 'pending' && (
            <div className="space-y-4">
              {showApprovalForm && (
                <div className="border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Approve Request</h4>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Optional: Add approval reason..."
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="secondary" size="sm" onClick={() => setShowApprovalForm(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => onApprove(request.id, approvalReason)}>
                      Confirm Approval
                    </Button>
                  </div>
                </div>
              )}

              {showRejectionForm && (
                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Reject Request</h4>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none dark:bg-gray-700 dark:text-white"
                    placeholder="Required: Provide rejection reason..."
                    required
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="secondary" size="sm" onClick={() => setShowRejectionForm(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => onReject(request.id, rejectionReason)}
                      disabled={!rejectionReason.trim()}
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}

              {!showApprovalForm && !showRejectionForm && (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={() => setShowRejectionForm(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => setShowApprovalForm(true)}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}