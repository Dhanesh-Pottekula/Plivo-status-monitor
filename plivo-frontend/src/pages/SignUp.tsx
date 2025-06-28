import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader } from 'lucide-react';
import useSignUp from '@/hooks/useSignUp';

const SignUp: React.FC = () => {
  const { isLoading, formData, errors, handleInputChange, handleSubmit, handleLoginClick ,token} = useSignUp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
            {token ? "You are signing up as a team member":'Sign up to get started with your organization'}
            </CardDescription>
            {errors.token && (
              <p className="text-red-500 text-sm text-center">{errors.token}</p>
            )}
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
                      id="username"
                      type="email"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={token?true:false}
                      placeholder="john@example.com"
                      className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
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
                      disabled={token?true:false}
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
                      disabled={token?true:false}
                    />
                    {errors.organization_link && (
                      <p className="text-red-500 text-sm">{errors.organization_link}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
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
                      placeholder=""
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
                      placeholder=""
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
                  onClick={() => handleLoginClick()}
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