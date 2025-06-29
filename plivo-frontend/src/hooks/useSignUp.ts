import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole, type SignUpFormData } from '../_constants/Interfaces/UserInterfaces';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateOrganizationName,
  validateUrl
} from '../_helpers/validators';
import { useDispatch } from 'react-redux';

import { signUpAction, getUserAction, verifyInviteTokenAction } from '@/_redux/actions/user.actions';
import type { AppDispatch } from '@/_redux/store';

function useSignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: '',
    username: '',
    password: '',
    confirm_password: '',
    role: UserRole.ADMIN,
    organization_name: '',
    organization_link: '',
    token: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
const dispatch = useDispatch<AppDispatch>()


    useEffect(() => {
      if(token){
        verifyInviteToken(token);
      }
    }, [token]);

    const verifyInviteToken = async (token: string) => {
      const response = await dispatch(verifyInviteTokenAction(token));
      if(response.success){
        setFormData(prev => ({
          ...prev,
          token: token || '',
          role: response.invite_data.role || UserRole.TEAM,
          username: response.invite_data.username || '',
          organization_name: response.invite_data.organization.name || '',
          organization_link: response.invite_data.organization.domain || '',
        }));
      }else{
        setErrors({
          token: response.error || 'Invalid invite token'
        });
      }
    }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    // Use validator helpers
    const fullNameError = validateFullName(formData.full_name);
    if (fullNameError) newErrors.full_name = fullNameError;

    const emailError = validateEmail(formData.username);
    if (emailError) newErrors.username = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validatePasswordConfirmation(formData.password, formData.confirm_password);
    if (confirmPasswordError) newErrors.confirm_password = confirmPasswordError;

    const organizationNameError = validateOrganizationName(formData.organization_name);
    if (organizationNameError) newErrors.organization_name = organizationNameError;

    const organizationLinkError = validateUrl(formData.organization_link, false);
    if (organizationLinkError) newErrors.organization_link = organizationLinkError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log("formData",formData);
      await dispatch(signUpAction(formData))
      await dispatch(getUserAction())
    } catch {
      setErrors({ username: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLoginClick = () => {
    navigate('/login');
  };
  return {
    isLoading,
    formData,
    errors,
    handleInputChange,
    validateForm,
    handleLoginClick,
    handleSubmit,
    token
  }
}

export default useSignUp