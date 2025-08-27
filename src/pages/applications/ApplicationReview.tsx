import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ApplicationsList } from './components/ApplicationsList';
import { ApplicationDetail } from './components/ApplicationDetail';

export function ApplicationReview() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<ApplicationsList />} />
        <Route path="/:id" element={<ApplicationDetail />} />
      </Routes>
    </div>
  );
}