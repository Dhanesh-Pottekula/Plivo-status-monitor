import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/_contexts/AuthContext'
import SplashScreen from '@/components/SplashScreen'

function PublicRoute() {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (
          <SplashScreen />
        );
    }

    if (user?.id) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default PublicRoute