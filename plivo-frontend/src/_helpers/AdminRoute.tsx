


import { useAuth } from "@/_contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";


const AdminRoute = (): React.JSX.Element => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#f0f0f0",
        }}
      >
        {/* added color to loader--------  */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === "admin") {
    // If we're at the admin root path (no outlet match), redirect to dashboard
    if (location.pathname === "/") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default AdminRoute;
