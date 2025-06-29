import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./_contexts/AuthContext";
import PublicRoute from "./_helpers/PublicRoute";
import PrivateRoute from "./_helpers/PrivateRoute";
import BaseUrlComponent from "./_helpers/BaseRoute";
import AdminRoute from "./_helpers/AdminRoute";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import { appRoutes } from "./config/appRoutes";
import { Provider } from "react-redux";
import AdminDashboard from "./pages/AdminDashboard";
import TeamMembers from "./pages/TeamMembers";
import { store } from "./_redux/store";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";

// App Routes component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path={appRoutes.login} element={<LoginPage />} />
        <Route path={appRoutes.signup} element={<SignUp />} />
        {/* <Route path={appRoutes.services} element={<ServicesPage />} /> */}
      </Route>
      <Route path={appRoutes.dashboard} element={<BaseUrlComponent />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute />}>
        {/* Admin routes */}
        <Route path="/" element={<AdminRoute />}>
          <Route path={appRoutes.admin_dashboard} element={<AdminDashboard />} /> 
          <Route path={appRoutes.team_members} element={<TeamMembers />} />
        </Route>

        {/* Common routes */}
        <Route path={appRoutes.services} element={<ServicesPage />} />
        <Route path={appRoutes.service_details} element={<ServiceDetailsPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
