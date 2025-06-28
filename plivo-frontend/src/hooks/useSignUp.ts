import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { signUpAction, getUserAction } from '@/_redux/actions/user.actions';
import type { AppDispatch } from '@/_redux/store';

function useSignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: '',
    username: '',
    password: '',
    confirm_password: '',
    role: UserRole.USER,
    organization_name: '',
    organization_link: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
const dispatch = useDispatch<AppDispatch>()
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
  }
}

export default useSignUp