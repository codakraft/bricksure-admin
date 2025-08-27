import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Globe, Palette } from 'lucide-react';
import { Button } from '../../../components/common/Button';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

const featureFlags: FeatureFlag[] = [
  {
    id: 'whatsapp_notifications',
    name: 'WhatsApp Notifications',
    description: 'Enable WhatsApp notifications for policy updates',
    enabled: true,
    category: 'Notifications'
  },
  {
    id: 'auto_renewal',
    name: 'Auto Renewal',
    description: 'Automatically renew policies before expiration',
    enabled: false,
    category: 'Policies'
  },
  {
    id: 'ai_quote_tips',
    name: 'AI Quote Tips',
    description: 'Show AI-powered tips during quote process',
    enabled: true,
    category: 'User Experience'
  },
  {
    id: 'dsu_rider',
    name: 'DSU Rider',
    description: 'Enable Delayed Settlement Underwriting rider',
    enabled: false,
    category: 'Products'
  },
  {
    id: 'academic_mode',
    name: 'Academic Mode',
    description: 'Allow anonymized data export for research',
    enabled: true,
    category: 'Analytics'
  }
];

const systemConfigs = [
  {
    name: 'Session Timeout',
    value: '30 minutes',
    category: 'Security'
  },
  {
    name: 'Max File Upload Size',
    value: '10 MB',
    category: 'System'
  },
  {
    name: 'Default Currency',
    value: 'NGN (₦)',
    category: 'Localization'
  },
  {
    name: 'Backup Frequency',
    value: 'Daily at 2:00 AM',
    category: 'Database'
  }
];

export function SettingsOverview() {
  const [activeTab, setActiveTab] = useState('features');
  const [flags, setFlags] = useState<FeatureFlag[]>(featureFlags);

  const toggleFeatureFlag = (id: string) => {
    setFlags(prev => prev.map(flag => 
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
    ));
  };

  return (
    <div className="space-y-6">
      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { name: 'General', icon: Settings, color: 'blue' },
          { name: 'Security', icon: Shield, color: 'red' },
          { name: 'Notifications', icon: Bell, color: 'yellow' },
          { name: 'Database', icon: Database, color: 'green' },
          { name: 'Localization', icon: Globe, color: 'purple' },
          { name: 'Appearance', icon: Palette, color: 'indigo' }
        ].map((category) => (
          <div key={category.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className={`p-3 rounded-lg mx-auto w-fit mb-3 bg-${category.color}-50 text-${category.color}-600`}>
              <category.icon className="w-6 h-6" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'features', label: 'Feature Flags' },
              { key: 'system', label: 'System Config' },
              { key: 'security', label: 'Security' },
              { key: 'integrations', label: 'Integrations' }
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
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Flags</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable or disable features across the platform
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(
                  flags.reduce((acc, flag) => {
                    if (!acc[flag.category]) acc[flag.category] = [];
                    acc[flag.category].push(flag);
                    return acc;
                  }, {} as Record<string, FeatureFlag[]>)
                ).map(([category, categoryFlags]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {category}
                    </h4>
                    {categoryFlags.map((flag) => (
                      <div key={flag.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{flag.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{flag.description}</p>
                        </div>
                        <button
                          onClick={() => toggleFeatureFlag(flag.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            flag.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              flag.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h3>
              
              <div className="space-y-4">
                {Object.entries(
                  systemConfigs.reduce((acc, config) => {
                    if (!acc[config.category]) acc[config.category] = [];
                    acc[config.category].push(config);
                    return acc;
                  }, {} as Record<string, typeof systemConfigs>)
                ).map(([category, categoryConfigs]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {category}
                    </h4>
                    {categoryConfigs.map((config, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{config.name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{config.value}</span>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Multi-Factor Authentication</h4>
                      <p className="text-sm text-green-700 mt-1">Enforced for all admin users</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="secondary">Configure</Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <Database className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-800">Data Encryption</h4>
                      <p className="text-sm text-blue-700 mt-1">AES-256 encryption enabled</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="secondary">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">External Integrations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Payment Gateway', status: 'connected', type: 'Paystack' },
                  { name: 'SMS Provider', status: 'connected', type: 'Twilio' },
                  { name: 'Email Service', status: 'connected', type: 'SendGrid' },
                  { name: 'KYC Provider', status: 'disconnected', type: 'Smile Identity' }
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{integration.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{integration.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.status === 'connected' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {integration.status.toUpperCase()}
                      </span>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
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