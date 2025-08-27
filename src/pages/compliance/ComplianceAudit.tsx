import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ComplianceOverview } from './components/ComplianceOverview';
import { ComplianceServices } from './components/ComplianceServices';

export function ComplianceAudit() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<ComplianceOverview />} />
        <Route path="/services" element={<ComplianceServices />} />
      </Routes>
    </div>
  );
}