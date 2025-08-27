import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WalletOverview } from './components/WalletOverview';
import { FinancialReports } from './components/FinancialReports';

export function WalletFinance() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<WalletOverview />} />
        <Route path="/reports" element={<FinancialReports />} />
      </Routes>
    </div>
  );
}