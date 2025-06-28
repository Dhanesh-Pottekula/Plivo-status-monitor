import { useAuth } from "@/_contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import { Navigate, Outlet } from "react-router-dom";

const MentorRoute = (): React.JSX.Element => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <SplashScreen />
    );
  } else {
    return user?.role === "team" ? <Outlet /> : <Navigate to="/login" replace />;
  }
};

export default MentorRoute;
