import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UsersList } from './components/UsersList';
import { UserDetail } from './components/UserDetail';
import { CreateUser } from './components/CreateUser';

export function UserManagement() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/:id" element={<UserDetail />} />
      </Routes>
    </div>
  );
}