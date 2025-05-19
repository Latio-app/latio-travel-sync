import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWalletStore } from "@/store/useStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { connected } = useWalletStore();
  const location = useLocation();

  if (!connected) {
    // Redirect to landing page but save the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
