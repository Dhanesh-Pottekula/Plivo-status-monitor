import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';
import useTeamMembers from '@/hooks/useTeamMembers';
import { InviteTeamMemberModal } from '@/components/InviteTeamMemberModal';

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
    openModal
  } = useTeamMembers();

  return (
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

      {/* Team Members List */}
      <div className="grid gap-6 bg-transparent">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Team Members
            </CardTitle>
            <CardDescription>
              View and manage your team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No team members found</p>
              <p className="text-sm">Invite team members to get started</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TeamMembers; 