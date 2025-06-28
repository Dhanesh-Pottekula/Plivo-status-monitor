
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../_contexts/AuthContext";

const BaseUrlComponent = () => {
  const { user } = useAuth();
  console.log(user);
  if (!user?.id) {
    return <Navigate replace to="/login" />;
  }
  if (user?.role === "admin") {
    return <Navigate replace to="/admin_dashboard" />;
  }
  if (user?.role === "teacher") {
    return <Navigate replace to="/teacher_dashboard" />;
  }
  if (user?.role === "student") {
    return <Navigate replace to="/student_dashboard" />;
  }
  if (user?.role === "parent") {
    return <Navigate replace to="/parent_dashboard" />;
  }
  return <Outlet />;
};

export default BaseUrlComponent;
