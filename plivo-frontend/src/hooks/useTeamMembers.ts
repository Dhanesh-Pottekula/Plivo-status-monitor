import { generateInviteLinkAction, getTeamMembersAction } from '@/_redux/actions/user.actions';
import type { AppDispatch, RootState } from '@/_redux/store';
    import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
 
function useTeamMembers() {
   const dispatch = useDispatch<AppDispatch>();
   const { teamMembers } = useSelector((state: RootState) => state.getTeamMembersListReducer);


   const [username, setUsername] = useState('');
   const [copied, setCopied] = useState(false);
   const [openInviteLinkModal, setOpenInviteLinkModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [inviteLink, setInviteLink] = useState('');
   const [error, setError] = useState('');
   
   useEffect(() => {
    const timeout = setTimeout(() => {
      getTeamMembersList();
    }, 0);
  
    return () => clearTimeout(timeout); // Cleanup to avoid memory leaks
  }, []);
  

    const getTeamMembersList = async () => {
      try {
console.log("getTeamMembersList")
        await dispatch(getTeamMembersAction())
      } catch (error) {
        console.error('Failed to get team members:', error);
      } 
    }

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!username.trim()) return;
     setIsLoading(true);
     setError('');
     setInviteLink('');
     try {
       const response = await dispatch(generateInviteLinkAction({username: username.trim()}));
       setInviteLink(response.invite_url);
     } catch {
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
   openModal,
   teamMembers
  }
}

export default useTeamMembers