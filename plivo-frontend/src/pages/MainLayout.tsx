import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full bg-white shadow-lg">
          <Sidebar onClose={closeMobileSidebar} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Hamburger Button */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileSidebar}
            className="p-2"
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Plivo</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;