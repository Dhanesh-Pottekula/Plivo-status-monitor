
import { Navigate } from "react-router-dom";
import { useAuth } from "../_contexts/AuthContext";
import { appRoutes } from "../config/appRoutes";


const BaseUrlComponent = () => {
  const { user,isLoading } = useAuth();
  if(isLoading){
    return 
  }
  if (!user?.id) {
    return <Navigate replace to={appRoutes.login} />;
  }

  if (user?.role === "admin") {
    return <Navigate replace to={appRoutes.team_members} />;
  }else if (user?.role === "team" && user?.organization?.id) {
    return <Navigate replace to={appRoutes.services.replace(":org_id",user?.organization?.id||"")} />;
  }


};

export default BaseUrlComponent;
