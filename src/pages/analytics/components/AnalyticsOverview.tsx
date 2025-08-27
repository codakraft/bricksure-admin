import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, FileText, MapPin, Download, Play, Settings } from 'lucide-react';
import { Button } from '../../../components/common/Button';

const analyticsModules = [
  {
    name: 'Executive Dashboard',
    description: 'Premium, growth, retention, loss ratio, revenue metrics',
    icon: BarChart3,
    color: 'blue'
  },
  {
    name: 'Underwriting Analytics',
    description: 'Auto-approve rates, decision SLAs, risk mix analysis',
    icon: FileText,
    color: 'green'
  },
  {
    name: 'Pricing & Risk',
    description: 'Geographic heatmaps, peril trends, elasticity tests',
    icon: MapPin,
    color: 'purple'
  },
  {
    name: 'Customer Analytics',
    description: 'Funnel analysis, onboarding, engagement metrics',
    icon: Users,
    color: 'orange'
  }
];

const recentReports = [
  {
    name: 'Monthly Premium Report',
    type: 'Scheduled',
    lastRun: '2025-01-27T06:00:00Z',
    status: 'completed',
    format: 'PDF'
  },
  {
    name: 'Claims Ratio Analysis',
    type: 'On-demand',
    lastRun: '2025-01-26T14:30:00Z',
    status: 'completed',
    format: 'XLSX'
  },
  {
    name: 'Risk Distribution Map',
    type: 'Weekly',
    lastRun: '2025-01-25T08:00:00Z',
    status: 'completed',
    format: 'CSV'
  }
];

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200'
};

export function AnalyticsOverview() {
  const [activeTab, setActiveTab] = useState('dashboards');

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Dashboards</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reports Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1.2M</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'dashboards', label: 'Dashboards' },
              { key: 'reports', label: 'Reports' },
              { key: 'explorer', label: 'Data Explorer' },
              { key: 'settings', label: 'Settings' }
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
          {activeTab === 'dashboards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboards</h3>
                <Button icon={<Settings className="w-4 h-4" />}>
                  Configure
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsModules.map((module) => (
                  <div key={module.name} className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${colorMap[module.color as keyof typeof colorMap]}`}>
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-white rounded-lg mr-4">
                        <module.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{module.name}</h4>
                        <p className="text-sm opacity-90 mt-1">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm opacity-75">
                        Last updated: 2 hours ago
                      </div>
                      <Button size="sm" variant="secondary" icon={<Play className="w-4 h-4" />}>
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Metrics Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-2">Conversion Rate</h4>
                  <p className="text-3xl font-bold">68.5%</p>
                  <p className="text-sm opacity-90 mt-2">+5.2% from last month</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-2">Claims Ratio</h4>
                  <p className="text-3xl font-bold">12.3%</p>
                  <p className="text-sm opacity-90 mt-2">-2.1% from last month</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-2">Auto-Approve Rate</h4>
                  <p className="text-3xl font-bold">87.2%</p>
                  <p className="text-sm opacity-90 mt-2">+3.8% from last month</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Management</h3>
                <Button icon={<Download className="w-4 h-4" />}>
                  Generate Report
                </Button>
              </div>

              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.format}</span>
                          <span>•</span>
                          <span>Last run: {new Date(report.lastRun).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {report.status.toUpperCase()}
                      </span>
                      <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" icon={<Play className="w-4 h-4" />}>
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'explorer' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Self-Service Data Explorer</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Interactive Data Explorer
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Drag and drop interface for creating custom analytics views, cohort analysis, and data visualization
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white">Dimensions</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">State, LGA, Property Type, Risk Level</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white">Measures</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quotes, Policies, Claims, Premium</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white">Visualizations</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Charts, Maps, Funnels, Cohorts</p>
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