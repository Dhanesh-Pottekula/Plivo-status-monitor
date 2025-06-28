import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../_contexts/AuthContext';
import { appRoutes } from '../config/appRoutes';
import { UserRole } from '../_constants/Interfaces/UserInterfaces';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { BarChart3Icon, LogOut, UsersIcon } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: appRoutes.admin_dashboard,
      icon: <BarChart3Icon className="h-4 w-4" />,
      adminOnly: true
    },
    {
      name: 'Team Members',
      href: appRoutes.team_members,
      icon: <UsersIcon className="h-4 w-4" />,
      adminOnly: true
    },

  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const filteredItems = navigationItems.filter(item => 
    !item.adminOnly || (user?.role === UserRole.ADMIN && item.adminOnly)
  );

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Plivo</h2>
      </div>

      {/* User Info */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.username || 'User'} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === UserRole.ADMIN ? 'Administrator' : user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-gray-500">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      <Separator className="bg-gray-100" />

      {/* Logout */}
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Handle logout logic here
            console.log('Logout clicked');
            if (onClose) onClose();
          }}
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 