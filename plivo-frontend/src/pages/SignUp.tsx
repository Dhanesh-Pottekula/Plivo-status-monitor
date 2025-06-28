import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../_constants/Interfaces/UserInterfaces';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader } from 'lucide-react';

interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  organization_name: string;
  organization_link: string;
}

const SignUp: React.FC = () => {
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

    // Basic validation
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = 'Organization name is required';
    }

    if (formData.organization_link.trim() && !/^https?:\/\/.+/.test(formData.organization_link)) {
      newErrors.organization_link = 'Please enter a valid URL (starting with http:// or https://)';
    }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sign up to get started with your organization
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={errors.full_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organization Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Organization Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization_name" className="text-sm font-medium text-gray-700">
                      Organization Name *
                    </Label>
                    <Input
                      id="organization_name"
                      type="text"
                      name="organization_name"
                      value={formData.organization_name}
                      onChange={handleInputChange}
                      placeholder="Acme Corporation"
                      className={errors.organization_name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.organization_name && (
                      <p className="text-red-500 text-sm">{errors.organization_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_link" className="text-sm font-medium text-gray-700">
                      Organization Website
                    </Label>
                    <Input
                      id="organization_link"
                      type="url"
                      name="organization_link"
                      value={formData.organization_link}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={errors.organization_link ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.organization_link && (
                      <p className="text-red-500 text-sm">{errors.organization_link}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={errors.confirm_password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm">{errors.confirm_password}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;