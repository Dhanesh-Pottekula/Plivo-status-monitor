// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return 'Email is invalid';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password: string, minLength: number = 8): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  
  return null;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  
  return null;
};

// URL validation
export const validateUrl = (url: string, required: boolean = false): string | null => {
  if (!url.trim()) {
    if (required) {
      return 'URL is required';
    }
    return null; // Empty URL is allowed if not required
  }
  
  const urlRegex = /^https?:\/\/.+/;
  if (!urlRegex.test(url)) {
    return 'Please enter a valid URL (starting with http:// or https://)';
  }
  
  return null;
};

// Full name validation
export const validateFullName = (fullName: string): string | null => {
  return validateRequired(fullName, 'Full name');
};

// Organization name validation
export const validateOrganizationName = (organizationName: string): string | null => {
  return validateRequired(organizationName, 'Organization name');
};

// Phone number validation (basic)
export const validatePhoneNumber = (phone: string, required: boolean = false): string | null => {
  if (!phone.trim()) {
    if (required) {
      return 'Phone number is required';
    }
    return null;
  }
  
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return 'Username is required';
  }
  
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  
  if (username.length > 30) {
    return 'Username must be less than 30 characters';
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  
  return null;
};

// Generic form validation helper
export const validateForm = <T extends Record<string, unknown>>(
  formData: T,
  validators: Record<keyof T, (value: unknown) => string | null>
): { isValid: boolean; errors: Partial<T> } => {
  const errors: Partial<T> = {};
  
  for (const [field, validator] of Object.entries(validators)) {
    const error = validator(formData[field as keyof T]);
    if (error) {
      errors[field as keyof T] = error as T[keyof T];
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
