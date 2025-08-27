import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface MakerCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  entityType: string;
  entityId: string;
  data: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onSubmit: () => void;
}

const riskColors = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  critical: 'text-red-600 bg-red-50 border-red-200'
};

const riskIcons = {
  low: CheckCircle,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: XCircle
};

export function MakerCheckerModal({
  isOpen,
  onClose,
  action,
  entityType,
  entityId,
  data,
  riskLevel,
  onSubmit
}: MakerCheckerModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { submitMakerCheckerRequest } = useAuth();
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const RiskIcon = riskIcons[riskLevel];

  const handleSubmit = async () => {
    if (!reason.trim()) {
      addNotification({
        type: 'error',
        title: 'Reason Required',
        message: 'Please provide a reason for this action.'
      });
      return;
    }

    setLoading(true);
    try {
      const requestId = await submitMakerCheckerRequest({
        action,
        entityType,
        entityId,
        data: { ...data, reason },
        riskLevel
      });

      addNotification({
        type: 'success',
        title: 'Request Submitted',
        message: `Your ${action} request has been submitted for approval. Request ID: ${requestId}`
      });

      onSubmit();
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit maker-checker request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Maker-Checker Approval</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Risk Level Indicator */}
          <div className={`flex items-center p-3 rounded-lg border ${riskColors[riskLevel]}`}>
            <RiskIcon className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Risk Level: {riskLevel.toUpperCase()}</p>
              <p className="text-sm opacity-90">This action requires approval due to its risk level</p>
            </div>
          </div>

          {/* Action Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Action Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Action:</span>
                <span className="font-medium text-gray-900 dark:text-white">{action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Entity Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">{entityType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Entity ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">{entityId}</span>
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Action *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Please provide a detailed reason for this action..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              loading={loading}
              disabled={!reason.trim()}
            >
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}