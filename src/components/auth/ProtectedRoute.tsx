
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
  requiredRole?: string;
  public?: boolean; // New prop to indicate if route is public
}

const ProtectedRoute = ({ 
  children, 
  element,
  requireAdmin = false,
  requireStaff = false,
  requiredRole,
  public: isPublic = false // Default to false
}: ProtectedRouteProps) => {
  const { user, isAdmin, isStaff, isLoading } = useAuth();
  
  // If route is public, render it regardless of auth state
  if (isPublic) {
    return <>{element || children}</>;
  }
  
  if (isLoading) {
    // Return loading state while checking authentication
    return <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
    </div>;
  }
  
  // Redirect to login if not authenticated and route is protected
  if (!user && !isPublic) {
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
