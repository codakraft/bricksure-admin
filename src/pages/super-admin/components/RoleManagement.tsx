import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Users, Search } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { SYSTEM_RIGHTS, SYSTEM_ROLES } from '../../../contexts/AuthContext';
import { Role, Right } from '../../../types/auth';
import { CreateRoleModal } from './CreateRoleModal';
import { EditRoleModal } from './EditRoleModal';

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(SYSTEM_ROLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = (newRole: Omit<Role, 'id' | 'createdAt' | 'createdBy'>) => {
    const role: Role = {
      ...newRole,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    setRoles([...roles, role]);
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const getRightsByCategory = () => {
    return SYSTEM_RIGHTS.reduce((acc, right) => {
      if (!acc[right.category]) {
        acc[right.category] = [];
      }
      acc[right.category].push(right);
      return acc;
    }, {} as Record<string, Right[]>);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Role Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage user roles and permissions
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                  {role.isSystem && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mt-1">
                      System Role
                    </span>
                  )}
                </div>
              </div>
              {!role.isSystem && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{role.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Permissions:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {role.rights.includes('*') ? 'All' : role.rights.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(role.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {!role.isSystem && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setEditingRole(role)}
                >
                  Edit Role
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* System Rights Reference */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available System Rights</h3>
        <div className="space-y-6">
          {Object.entries(getRightsByCategory()).map(([category, rights]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rights.map((right) => (
                  <div key={right.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{right.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{right.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      right.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      right.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      right.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {right.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRole}
          availableRights={SYSTEM_RIGHTS}
        />
      )}

      {editingRole && (
        <EditRoleModal
          isOpen={!!editingRole}
          onClose={() => setEditingRole(null)}
          onSubmit={handleUpdateRole}
          role={editingRole}
          availableRights={SYSTEM_RIGHTS}
        />
      )}
    </div>
  );
}