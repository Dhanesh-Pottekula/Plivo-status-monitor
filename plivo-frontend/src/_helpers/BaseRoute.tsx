
import { Navigate } from "react-router-dom";
import { useAuth } from "../_contexts/AuthContext";
import { appRoutes } from "../config/appRoutes";

const BaseUrlComponent = () => {
  const { user } = useAuth();
  if (!user?.id) {
    return <Navigate replace to={appRoutes.login} />;
  }
  if (user?.role === "admin") {
    return <Navigate replace to={appRoutes.services} />;
  }else if (user?.role === "team") {
    return <Navigate replace to={appRoutes.services} />;
  }else{
    return <Navigate replace to={appRoutes.organizations_list} />;
  }
  // return <Outlet />;
};

export default BaseUrlComponent;
