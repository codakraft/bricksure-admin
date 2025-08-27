import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoleManagement } from './components/RoleManagement';
import { MakerCheckerQueue } from './components/MakerCheckerQueue';
import { SystemOverview } from './components/SystemOverview';

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<SystemOverview />} />
        <Route path="/roles" element={<RoleManagement />} />
        <Route path="/maker-checker" element={<MakerCheckerQueue />} />
      </Routes>
    </div>
  );
}