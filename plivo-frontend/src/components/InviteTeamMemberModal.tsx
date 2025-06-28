import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';

interface InviteTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  setUsername: (username: string) => void;
  copied: boolean;
  isLoading: boolean;
  inviteLink: string | null;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCopyLink: () => void;
}

export function InviteTeamMemberModal({
  isOpen,
  onClose,
  username,
  setUsername,
  copied,
  isLoading,
  inviteLink,
  error,
  onSubmit,
  onCopyLink
}: InviteTeamMemberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Enter the username for the team member you want to invite. They will receive a unique invitation link.
          </DialogDescription>
        </DialogHeader>
        
        {!inviteLink ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading || !username.trim()}
                variant="destructive"
                onClick={onSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                {isLoading ? 'Generating...' : 'Generate Invite Link'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Invitation Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 border-gray-200 bg-gray-50 text-gray-900"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCopyLink}
                  className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Link generated successfully!</p>
              <p className="mt-1 text-blue-800">Share this link with your team member. The link will expire in 24 hours.</p>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 