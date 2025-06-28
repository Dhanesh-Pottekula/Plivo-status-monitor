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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-green-600">{activeMembers.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revoked Members</p>
                  <p className="text-2xl font-bold text-yellow-600">{revokedMembers.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-yellow-600">{teamMembers?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Members Card */}
        {activeMembers.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Active Members
              </CardTitle>
              <CardDescription>
                Team members with active access to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Revoked Members
              </CardTitle>
              <CardDescription>
                Team members with revoked  access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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