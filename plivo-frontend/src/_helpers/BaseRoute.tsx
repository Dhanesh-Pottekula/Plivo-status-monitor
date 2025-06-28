
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../_contexts/AuthContext";
import { appRoutes } from "../config/appRoutes";

const BaseUrlComponent = () => {
  const { user } = useAuth();
  console.log(user);
  if (!user?.id) {
    return <Navigate replace to={appRoutes.login} />;
  }
  if (user?.role === "admin") {
    return <Navigate replace to={appRoutes.admin_dashboard} />;
  }
  return <Outlet />;
};

export default BaseUrlComponent;
