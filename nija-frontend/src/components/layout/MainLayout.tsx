import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar, Topbar } from './';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-layout-content">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-layout-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;