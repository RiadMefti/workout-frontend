import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/AuthContext";

interface PublicRouteProps {
  children: ReactNode;
}


//The PublicRoute component is a wrapper for routes that do not require authentication.
//It redirects authenticated users to the /dashboard route.
export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
