import { generateInviteLink } from '@/_redux/userSlice';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react'
import type { InviteLinkInterface } from '@/_constants/Interfaces/UserInterfaces';
 
function useTeamMembers() {
   const dispatch = useDispatch();
   const [username, setUsername] = useState('');
   const [copied, setCopied] = useState(false);
   const [openInviteLinkModal, setOpenInviteLinkModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [inviteLink, setInviteLink] = useState('');
   const [error, setError] = useState('');
   
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!username.trim()) return;
     setIsLoading(true);
     setError('');
     setInviteLink('');
     try {
       const response = await dispatch(generateInviteLink({username: username.trim()})) as unknown as  InviteLinkInterface;
       setInviteLink(response.inviteLink);
     } catch (err) {
       setError('Failed to generate invite link');
     } finally {
       setIsLoading(false);
     }
   };

   const handleCopyLink = async () => {
     if (inviteLink) {
       try {
         await navigator.clipboard.writeText(inviteLink);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
       } catch (err) {
         console.error('Failed to copy link:', err);
       }
     }
   };

   const handleCloseModal = () => {
     setOpenInviteLinkModal(false);
     setUsername('');
     setCopied(false);
     setInviteLink('');
     setError('');
   };

   const openModal = () => {
     setOpenInviteLinkModal(true);
   };

  return {
   username,
   setUsername,
   copied,
   setCopied,
   openInviteLinkModal,
   setOpenInviteLinkModal,
   isLoading,
   inviteLink,
   error,
   handleSubmit,
   handleCopyLink,
   handleCloseModal,
   openModal
  }
}

export default useTeamMembers