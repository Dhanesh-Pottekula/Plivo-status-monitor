import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Crown,
  User,
  Shield,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  UserRole,
  type TeamMemberInterface,
} from "@/_constants/Interfaces/UserInterfaces";

interface TeamMemberItemProps {
  member: TeamMemberInterface;
  isActive: boolean;
  grantAndRevokeAccess?: (userId: string, has_access: boolean) => void;
  isAccessLoading?: boolean;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  isActive,
  grantAndRevokeAccess,
  isAccessLoading = false,
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Crown className="h-3 w-3 text-yellow-600" />;
      case UserRole.TEAM:
        return <Shield className="h-3 w-3 text-blue-600" />;
      case UserRole.USER:
        return <User className="h-3 w-3 text-gray-600" />;
      default:
        return <User className="h-3 w-3 text-gray-600" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "default";
      case UserRole.TEAM:
        return "secondary";
      case UserRole.USER:
        return "outline";
      default:
        return "outline";
    }
  };

  const getDisplayName = () => {
    return member.used_by?.full_name || member.username;
  };

  const getAvatarFallback = () => {
    return (
      member.used_by?.full_name?.charAt(0)?.toUpperCase() ||
      member.username.charAt(0).toUpperCase()
    );
  };

  const getStatusIcon = () => {
    if (isActive) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else {
      return <Clock className="h-3 w-3 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 text-xs"
        >
          Active
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="text-yellow-600 border-yellow-300 text-xs"
        >
          Revoked
        </Badge>
      );
    }
  };

  const getBackgroundColor = () => {
    return isActive ? "bg-green-50/50" : "bg-yellow-50/50";
  };

  const getAvatarColor = () => {
    return isActive
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";
  };

  const handleGrantAccess = () => {
    if (grantAndRevokeAccess && member.used_by?.id) {
      grantAndRevokeAccess(member.used_by?.id, true);
    }
  };

  const handleRevokeAccess = () => {
    if (grantAndRevokeAccess && member.used_by?.id) {
      grantAndRevokeAccess(member.used_by?.id, false);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border ${getBackgroundColor()} relative gap-3`}
    >
      {/* User Info Section */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback
            className={`${getAvatarColor()} font-semibold text-sm`}
          >
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {isActive ? getDisplayName() : `@${member.username}`}
            </h3>
            {getStatusIcon()}
          </div>
          <p className="text-xs text-gray-600 truncate">
            {isActive ? `@${member.username}` : "Invitation sent"}
          </p>
        </div>
      </div>

      {/* Badges and Actions Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={getRoleBadgeVariant(member.role)}
            className="flex items-center gap-1 text-xs"
          >
            {getRoleIcon(member.role)}
            <span className="hidden sm:inline">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </span>
            <span className="sm:hidden">
              {member.role.charAt(0).toUpperCase()}
            </span>
          </Badge>
          {getStatusBadge()}
        </div>

        {/* Access Management Button */}
        {grantAndRevokeAccess && (
          <div className="w-full sm:w-auto">
            {!isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleGrantAccess}
                disabled={isAccessLoading}
                className="w-full sm:w-auto h-7 px-2 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Grant Access</span>
                <span className="sm:hidden">Grant</span>
              </Button>
            )}
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRevokeAccess}
                disabled={isAccessLoading}
                className="w-full sm:w-auto h-7 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <UserX className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Revoke Access</span>
                <span className="sm:hidden">Revoke</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberItem;
