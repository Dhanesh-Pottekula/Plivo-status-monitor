import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/_redux/store';
import {  getOrganizationsAction } from '@/_redux/actions';
import { useEffect } from 'react';
import { appRoutes } from '@/config/appRoutes';
import { useNavigate } from 'react-router-dom';

export const useOrganizations = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const organizations = useSelector((state: RootState) => state.getOrganizationsReducer.organizations);

  useEffect(() => {
    getOrganizations();
  },[])
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOrgClick = (orgId: string) => {
    navigate(appRoutes.services.replace(":org_id", orgId));
  }
  
    const getOrganizations = async () => {
      await dispatch(getOrganizationsAction());
    }


  return {
    // State
    
    organizations,
    handleOrgClick,
    formatDate,
  };
}; 