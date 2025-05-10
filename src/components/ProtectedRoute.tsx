
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: "user" | "admin" | undefined;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      navigate(redirectTo);
      return;
    }

    if (allowedRole && user.role !== allowedRole) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
      return;
    }
  }, [navigate, allowedRole, redirectTo]);

  return <>{children}</>;
}

export default ProtectedRoute;
