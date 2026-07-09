// components/shared/ProtectedRoute.jsx
// Redirects unauthenticated users to login

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" light />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
