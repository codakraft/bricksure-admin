import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CertificateOverview } from './components/CertificateOverview';
import { CertificateIssuance } from './components/CertificateIssuance';

export function CertificateFactory() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<CertificateOverview />} />
        <Route path="/issue" element={<CertificateIssuance />} />
      </Routes>
    </div>
  );
}