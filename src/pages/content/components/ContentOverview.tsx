import React, { useState } from 'react';
import { MessageSquare, FileText, Users, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

const contentStats = [
  {
    name: 'FAQs',
    value: '87',
    change: '+5',
    icon: MessageSquare
  },
  {
    name: 'Coverage Articles',
    value: '34',
    change: '+2',
    icon: FileText
  },
  {
    name: 'Community Posts',
    value: '156',
    change: '+12',
    icon: Users
  },
  {
    name: 'Campaigns',
    value: '8',
    change: '+1',
    icon: Calendar
  }
];

const contentItems = [
  {
    id: 'FAQ-001',
    title: 'What is covered under fire insurance?',
    type: 'FAQ',
    status: 'published',
    lastModified: '2025-01-27T10:30:00Z',
    views: 1247
  },
  {
    id: 'ART-001',
    title: 'Understanding Property Valuation',
    type: 'Article',
    status: 'draft',
    lastModified: '2025-01-26T14:20:00Z',
    views: 0
  },
  {
    id: 'POST-001',
    title: 'Monthly Risk Advisory: Rainy Season Preparations',
    type: 'Community Post',
    status: 'published',
    lastModified: '2025-01-25T16:45:00Z',
    views: 892
  }
];

export function ContentOverview() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contentStats.map((stat) => (
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
              { key: 'faqs', label: 'FAQs' },
              { key: 'articles', label: 'Articles' },
              { key: 'campaigns', label: 'Campaigns' }
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Content</h3>
                <Button icon={<Plus className="w-4 h-4" />}>
                  Create Content
                </Button>
              </div>

              <div className="space-y-4">
                {contentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {item.type === 'FAQ' && <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                        {item.type === 'Article' && <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                        {item.type === 'Community Post' && <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{item.type}</span>
                          <StatusBadge status={item.status === 'published' ? 'active' : 'draft'} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                <Button icon={<Plus className="w-4 h-4" />}>
                  Add FAQ
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { question: 'What is covered under fire insurance?', category: 'Coverage', status: 'published' },
                  { question: 'How do I file a claim?', category: 'Claims', status: 'published' },
                  { question: 'What documents do I need for a quote?', category: 'Quotes', status: 'draft' }
                ].map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <StatusBadge status={faq.status === 'published' ? 'active' : 'draft'} />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white mb-3">{faq.question}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
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