import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)} />
        <div className="relative h-full w-64 bg-white">
          <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col ">
        {/* Main Content */}
        <main className="flex-1 max-w-[100vw] p-4 overflow-y-auto max-h-screen ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;