import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log(isAuthenticated)

  if (loading) {
    return null; // ou um carregando/loader aqui
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login"/>;
};

export default PrivateRoute;