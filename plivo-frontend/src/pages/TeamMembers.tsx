import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Users, UserPlus, CheckCircle, Crown, User, Shield } from 'lucide-react';
import useTeamMembers from '@/hooks/useTeamMembers';
import { InviteTeamMemberModal } from '@/components/InviteTeamMemberModal';
import MainLayout from './MainLayout';

// Define UserRole enum locally to avoid import issues
enum UserRole {
  ADMIN = "admin",
  TEAM = "team",
  USER = "user",
}

function TeamMembers() {
  const {
    username,
    setUsername,
    copied,
    openInviteLinkModal,
    isLoading,
    inviteLink,
    error,
    handleSubmit,
    handleCopyLink,
    handleCloseModal,
    openModal,
    teamMembers
  } = useTeamMembers();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case UserRole.TEAM:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case UserRole.USER:
        return <User className="h-4 w-4 text-gray-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'default';
      case UserRole.TEAM:
        return 'secondary';
      case UserRole.USER:
        return 'outline';
      default:
        return 'outline';
    }
  };
  const activeMembers = Array.isArray(teamMembers) ? teamMembers?.filter(member => member.used_by?.has_access) || [] : [];
  console.log(teamMembers);

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage your team and invite new members</p>
          </div>
          <Button onClick={openModal} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </Button>
        </div>

        <InviteTeamMemberModal
          isOpen={openInviteLinkModal}
          onClose={handleCloseModal}
          username={username}
          setUsername={setUsername}
          copied={copied}
          isLoading={isLoading}
          inviteLink={inviteLink}
          error={error}
          onSubmit={handleSubmit}
          onCopyLink={handleCopyLink}
        />

        {/* Stats Card */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Team Members</p>
                  <p className="text-2xl font-bold text-green-600">{activeMembers.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Team Members */}
        {activeMembers.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Team Members
              </CardTitle>
              <CardDescription>
                Members who have joined your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeMembers.map((member, index) => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {member.used_by?.full_name?.charAt(0)?.toUpperCase() || member.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {member.used_by?.full_name || member.username}
                            </h3>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <p className="text-sm text-gray-600">@{member.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                    {index < activeMembers.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                View and manage your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-sm mb-4">Start building your team by inviting new members</p>
                <Button onClick={openModal} className="flex items-center gap-2 mx-auto">
                  <UserPlus className="h-4 w-4" />
                  Invite Your First Member
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default TeamMembers; 