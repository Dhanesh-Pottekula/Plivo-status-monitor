import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/_contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = (): React.JSX.Element => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <SplashScreen />
    );
  } else {
      return user?.id ? <Outlet /> : <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
