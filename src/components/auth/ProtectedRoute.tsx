
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
  requiredRole?: string;
}

const ProtectedRoute = ({ 
  children, 
  element,
  requireAdmin = false,
  requireStaff = false,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, isAdmin, isStaff, isLoading } = useAuth();
  
  if (isLoading) {
    // Return loading state while checking authentication
    return <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
    </div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role requirements
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  if (requireStaff && !(isAdmin || isStaff)) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and meets role requirements
  return <>{element || children}</>;
};

export default ProtectedRoute;
