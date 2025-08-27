import React, { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearch } from './GlobalSearch';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '../../contexts/NotificationContext';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { notifications } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onSearchToggle={() => setSearchOpen(true)} />
        
        <main className="p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {searchOpen && (
        <GlobalSearch onClose={() => setSearchOpen(false)} />
      )}

      <NotificationPanel notifications={notifications} />
    </div>
  );
}