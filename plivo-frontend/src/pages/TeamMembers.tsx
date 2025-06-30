import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, UserPlus, CheckCircle, Clock, XCircle } from 'lucide-react';
import useTeamMembers from '@/hooks/useTeamMembers';
import { InviteTeamMemberModal } from '@/components/InviteTeamMemberModal';
import TeamMemberItem from '@/components/TeamMemberItem';
import MainLayout from './MainLayout';

function TeamMembers() {
  const {
    username,
    setUsername,
    copied,
    openInviteLinkModal,
    isLoading,
    inviteLink,
    error,
    isAccessLoading,
    handleSubmit,
    handleCopyLink,
    handleCloseModal,
    openModal,
    grantAndRevokeAccess,
    teamMembers
  } = useTeamMembers();

  // Separate team members by status
  const activeMembers = Array.isArray(teamMembers) ? teamMembers?.filter(member => member.used_by?.has_access) || [] : [];
  const revokedMembers = Array.isArray(teamMembers) ? teamMembers?.filter(member => !member.used_by?.has_access) || [] : [];

  console.log(teamMembers);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your team and invite new members</p>
          </div>
          <Button onClick={openModal} className="flex items-center gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite Team Member</span>
            <span className="sm:hidden">Invite Member</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{activeMembers.length}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revoked Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{revokedMembers.length}</p>
                </div>
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{teamMembers?.length || 0}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Members Card */}
        {activeMembers.length > 0 && (
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                Active Members
              </CardTitle>
              <CardDescription className="text-sm">
                Team members with active access to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {activeMembers.map((member, index) => (
                  <div key={member.id}>
                    <TeamMemberItem 
                      member={member} 
                      isActive={true} 
                      grantAndRevokeAccess={grantAndRevokeAccess}
                      isAccessLoading={isAccessLoading}
                    />
                    {index < activeMembers.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revoked Members Card */}
        {revokedMembers.length > 0 && (
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                Revoked Members
              </CardTitle>
              <CardDescription className="text-sm">
                Team members with revoked access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {revokedMembers.map((member, index) => (
                  <div key={member.id}>
                    <TeamMemberItem 
                      member={member} 
                      isActive={false} 
                      grantAndRevokeAccess={grantAndRevokeAccess}
                      isAccessLoading={isAccessLoading}
                    />
                    {index < revokedMembers.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {activeMembers.length === 0 && revokedMembers.length === 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Team Members
              </CardTitle>
              <CardDescription className="text-sm">
                View and manage your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 sm:py-12 text-gray-500">
                <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-sm mb-4 max-w-sm mx-auto">Start building your team by inviting new members</p>
                <Button onClick={openModal} className="flex items-center gap-2 mx-auto">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Invite Your First Member</span>
                  <span className="sm:hidden">Invite First Member</span>
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