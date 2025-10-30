import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { checkUserPermission } from "../../service/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    status,
    authData: user,
  } = useSelector((state: RootState) => state.auth);

  if (status === "loading") {
    console.log("ProtectedRoute: Still loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check permissions if required
  if (
    requiredPermission &&
    !checkUserPermission(user.permissions, requiredPermission)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
