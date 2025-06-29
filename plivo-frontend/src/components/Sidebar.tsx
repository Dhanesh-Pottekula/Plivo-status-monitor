import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../_contexts/AuthContext";
import { appRoutes } from "../config/appRoutes";
import { UserRole } from "../_constants/Interfaces/UserInterfaces";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Building2Icon,
  LogOut,
  ServerIcon,
  UsersIcon,
} from "lucide-react";
import { logoutAction } from "@/_redux/actions/user.actions";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/_redux/store";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const navigationItems = [
    {
      name: "Team Members",
      href: appRoutes.team_members,
      icon: <UsersIcon className="h-4 w-4" />,
      adminOnly: true,
      teamOnly: false,
    },
    {
      name: " My Services",
      href: appRoutes.services.replace(":org_id", user?.organization?.id || ""),
      icon: <ServerIcon className="h-4 w-4" />,
      adminOnly: true,
      teamOnly: true,
    },
    {
      name: "Organizations",
      href: appRoutes.organizations_list,
      icon: <Building2Icon className="h-4 w-4" />,
      userOnly: true,
    },
  ];

  const handleLinkClick = (href: string) => {
    navigate(href);
    if (onClose) {
      onClose();
    }
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const filteredItems = navigationItems.filter((item) => {
    return (!item.adminOnly && !item.teamOnly && !item.userOnly )||
      (user?.role === UserRole.ADMIN && item.adminOnly) ||
      (user?.role === UserRole.TEAM && item.teamOnly) ||
      (!user?.role&& item.userOnly);
  });

  const handleLogout = async () => {
    document.cookie.split(";").forEach(function(c) { 
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
     dispatch(logoutAction());
     //clear all cookies
    window.location.href = appRoutes.login;
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col max-h-screen">
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Plivo</h2>
      </div>

      {/* User Info */}
      {user?.role&&<div className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.username || "User"} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === UserRole.ADMIN
                ? "Administrator"
                : user?.role || "User"}
            </p>
          </div>
        </div>
      </div>}

      <Separator className="bg-gray-100" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              onClick={() => handleLinkClick(item.href)}
              className={`w-full justify-start ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-gray-500 mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Button>
          ))}
        </div>
      </nav>

      <Separator className="bg-gray-100" />

      {/* Logout */}
      <div className="px-3 py-4">
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleLogout();
            }}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span>Sign out</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate(appRoutes.login);
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span>Sign in</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
