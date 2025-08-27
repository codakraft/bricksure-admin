import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Role, Right } from '../../../types/auth';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: Role) => void;
  role: Role;
  availableRights: Right[];
}

export function EditRoleModal({ isOpen, onClose, onSubmit, role, availableRights }: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rights: [] as string[]
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        rights: [...role.rights]
      });
    }
  }, [role]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...role,
      ...formData
    });
    onClose();
  };

  const handleRightToggle = (rightId: string) => {
    setFormData(prev => ({
      ...prev,
      rights: prev.rights.includes(rightId)
        ? prev.rights.filter(id => id !== rightId)
        : [...prev.rights, rightId]
    }));
  };

  const rightsByCategory = availableRights.reduce((acc, right) => {
    if (!acc[right.category]) {
      acc[right.category] = [];
    }
    acc[right.category].push(right);
    return acc;
  }, {} as Record<string, Right[]>);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Role: {role.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the role's purpose and responsibilities"
                  required
                />
              </div>
            </div>

            {/* Rights Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assign Rights ({formData.rights.length} selected)
              </h3>
              
              <div className="space-y-6">
                {Object.entries(rightsByCategory).map(([category, rights]) => (
                  <div key={category} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rights.map((right) => (
                        <label key={right.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.rights.includes(right.id)}
                            onChange={() => handleRightToggle(right.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm text-gray-900 dark:text-white">{right.name}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                right.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                right.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                right.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {right.riskLevel}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{right.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.description || formData.rights.length === 0}>
              Update Role
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}