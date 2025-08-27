import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/common/Button';

const walletStats = [
  {
    name: 'Total Balance',
    value: '₦24,567,890',
    change: '+12%',
    changeType: 'increase' as const,
    icon: DollarSign
  },
  {
    name: 'Premium Collected',
    value: '₦18,450,000',
    change: '+8%',
    changeType: 'increase' as const,
    icon: TrendingUp
  },
  {
    name: 'Claims Paid',
    value: '₦2,890,000',
    change: '+15%',
    changeType: 'increase' as const,
    icon: TrendingDown
  },
  {
    name: 'Pending Refunds',
    value: '₦150,000',
    change: '-5%',
    changeType: 'decrease' as const,
    icon: RefreshCw
  }
];

const recentTransactions = [
  {
    id: 'TXN-001',
    type: 'Premium Payment',
    amount: '₦45,000',
    user: 'John Smith',
    status: 'completed',
    timestamp: '2025-01-27T10:30:00Z'
  },
  {
    id: 'TXN-002',
    type: 'Claim Payout',
    amount: '-₦25,000',
    user: 'Jane Doe',
    status: 'completed',
    timestamp: '2025-01-27T09:15:00Z'
  },
  {
    id: 'TXN-003',
    type: 'Refund',
    amount: '-₦15,000',
    user: 'Michael Brown',
    status: 'pending',
    timestamp: '2025-01-26T16:45:00Z'
  }
];

export function WalletOverview() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet & Finance</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage wallets, statements, reconciliations, and financial reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {walletStats.map((stat) => (
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
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
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
              { key: 'transactions', label: 'Transactions' },
              { key: 'reconciliation', label: 'Reconciliation' },
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
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="justify-start h-auto p-4" variant="secondary">
                    <div className="text-left">
                      <p className="font-medium">Generate Statement</p>
                      <p className="text-sm text-gray-500 mt-1">Export wallet statement</p>
                    </div>
                  </Button>
                  <Button className="justify-start h-auto p-4" variant="secondary">
                    <div className="text-left">
                      <p className="font-medium">Process Refund</p>
                      <p className="text-sm text-gray-500 mt-1">Issue customer refunds</p>
                    </div>
                  </Button>
                  <Button className="justify-start h-auto p-4" variant="secondary">
                    <div className="text-left">
                      <p className="font-medium">Reconcile Accounts</p>
                      <p className="text-sm text-gray-500 mt-1">Match bank transactions</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.type} - {transaction.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.amount}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reconciliation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Reconciliation</h3>
                <Button icon={<RefreshCw className="w-4 h-4" />}>
                  Run Reconciliation
                </Button>
              </div>
              
              {/* Reconciliation Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800">Matched</h4>
                  <p className="text-2xl font-bold text-green-900 mt-2">₦24,200,000</p>
                  <p className="text-sm text-green-700 mt-1">98.5% of transactions</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800">Pending</h4>
                  <p className="text-2xl font-bold text-yellow-900 mt-2">₦350,000</p>
                  <p className="text-sm text-yellow-700 mt-1">1.4% of transactions</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Exceptions
                  </h4>
                  <p className="text-2xl font-bold text-red-900 mt-2">₦25,000</p>
                  <p className="text-sm text-red-700 mt-1">0.1% of transactions</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Wallet Statements', description: 'Monthly wallet statements', format: 'PDF/CSV' },
                  { name: 'Premium Collection', description: 'Premium collection reports', format: 'XLSX' },
                  { name: 'Claims Analysis', description: 'Claims payment analysis', format: 'PDF' },
                  { name: 'Reconciliation Report', description: 'Daily reconciliation summary', format: 'CSV' }
                ].map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{report.format}</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                      Export
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