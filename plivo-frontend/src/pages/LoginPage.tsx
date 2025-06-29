
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useLogin from '@/hooks/useLogin'
import MainLayout from './MainLayout'

function LoginPage() {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useLogin()
  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </MainLayout>
  )
}

export default LoginPage