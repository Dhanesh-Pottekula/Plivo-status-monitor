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
import { Provider } from "react-redux";
import { store } from "./store";
// App Routes component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route path="/dashboard" element={<BaseUrlComponent />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute />}>
        {/* Admin routes */}
        <Route path="/" element={<AdminRoute />}></Route>

        {/* Common routes */}
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
