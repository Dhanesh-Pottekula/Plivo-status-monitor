import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Users, UserPlus, X } from 'lucide-react';
import useTeamMembers from '@/hooks/useTeamMembers';

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

      {/* Modal */}
      {openInviteLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invite Team Member</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Enter the username for the team member you want to invite. They will receive a unique invitation link.
            </p>
            
            {!inviteLink ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !username.trim()}>
                    {isLoading ? 'Generating...' : 'Generate Invite Link'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Invitation Link</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <p className="font-medium">Link generated successfully!</p>
                  <p className="mt-1">Share this link with your team member. The link will expire in 24 hours.</p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleCloseModal}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="grid gap-6">
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