import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../_constants/Interfaces/UserInterfaces';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateOrganizationName,
  validateUrl
} from '../_helpers/validators';

interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  organization_name: string;
  organization_link: string;
}
function useSignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: UserRole.USER,
    organization_name: '',
    organization_link: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

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

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

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
      const response = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login or dashboard based on role
        navigate('/login', { 
          state: { message: 'Account created successfully! Please log in.' }
        });
      } else {
        setErrors(data.errors || { email: 'Sign up failed. Please try again.' });
      }
    } catch {
      setErrors({ email: 'Network error. Please try again.' });
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