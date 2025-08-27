import React, { useState } from 'react';
import { Download, Calendar, Filter, TrendingUp, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useNotifications } from '../../../contexts/NotificationContext';

const reportTypes = [
  {
    id: 'wallet-statements',
    name: 'Wallet Statements',
    description: 'Individual user wallet statements with transaction history',
    format: 'PDF/CSV',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'premium-collection',
    name: 'Premium Collection Report',
    description: 'Premium collection analysis by period and product',
    format: 'XLSX',
    icon: TrendingUp,
    color: 'green'
  },
  {
    id: 'claims-analysis',
    name: 'Claims Analysis Report',
    description: 'Claims payment analysis and loss ratios',
    format: 'PDF',
    icon: BarChart3,
    color: 'orange'
  },
  {
    id: 'reconciliation',
    name: 'Daily Reconciliation',
    description: 'Daily reconciliation summary with exceptions',
    format: 'CSV',
    icon: DollarSign,
    color: 'purple'
  }
];

const recentReports = [
  {
    id: 'RPT-001',
    name: 'Monthly Wallet Statements - January 2025',
    type: 'wallet-statements',
    generatedAt: '2025-01-27T10:30:00Z',
    generatedBy: 'Finance Admin',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 'RPT-002',
    name: 'Premium Collection - Q4 2024',
    type: 'premium-collection',
    generatedAt: '2025-01-26T14:20:00Z',
    generatedBy: 'Finance Admin',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 'RPT-003',
    name: 'Claims Analysis - December 2024',
    type: 'claims-analysis',
    generatedAt: '2025-01-25T16:45:00Z',
    generatedBy: 'Claims Manager',
    status: 'processing',
    downloadUrl: null
  }
];

export function FinancialReports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const { addNotification } = useNotifications();

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      addNotification({
        type: 'error',
        title: 'Report Type Required',
        message: 'Please select a report type to generate.'
      });
      return;
    }

    setGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        type: 'success',
        title: 'Report Generated',
        message: 'Your financial report has been generated successfully and is ready for download.'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate report. Please try again.'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    addNotification({
      type: 'info',
      title: 'Download Started',
      message: `Report ${reportId} download has started.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Generate and manage financial reports and statements
        </p>
      </div>

      {/* Report Generator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate New Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedReport === report.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-lg mr-3 bg-${report.color}-50 text-${report.color}-600`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{report.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{report.format}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{report.description}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleGenerateReport}
            loading={generating}
            icon={<Download className="w-4 h-4" />}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reports</h3>
        
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Generated by {report.generatedBy}</span>
                    <span>•</span>
                    <span>{new Date(report.generatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'completed' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {report.status.toUpperCase()}
                </span>
                {report.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => handleDownloadReport(report.id)}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}