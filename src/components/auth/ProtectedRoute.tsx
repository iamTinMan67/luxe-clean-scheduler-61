
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
  requiredRole?: string;
  public?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  element,
  requireAdmin = false,
  requireStaff = false,
  requiredRole,
  public: isPublic = false
}: ProtectedRouteProps) => {
  const { user, isAdmin, isStaff, isLoading } = useAuth();
  const location = useLocation();
  
  // Return the element or children without any auth checks if route is public
  if (isPublic) {
    console.log("Rendering public route");
    return <>{element || children}</>;
  }
  
  // For non-protected routes, just render the element without conditions
  if (!requireAdmin && !requireStaff && !requiredRole) {
    console.log("Rendering non-protected route");
    return <>{element || children}</>;
  }
  
  if (isLoading) {
    // Return loading state while checking authentication
    return <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
    </div>;
  }
  
  // Redirect to login if not authenticated and route is protected
  if (!user && (requireAdmin || requireStaff || requiredRole)) {
    console.log("Redirecting to login - user not authenticated");
    return <Navigate to="/login" replace />;
  }
  
  // Check role requirements without redirecting to dashboard
  if (requiredRole === "admin" && !isAdmin) {
    console.log("Redirecting to login - user not admin");
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    console.log("Redirecting to login - user not admin");
    return <Navigate to="/login" replace />;
  }
  
  if (requireStaff && !(isAdmin || isStaff)) {
    console.log("Redirecting to login - user not staff");
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated and meets role requirements
  // Return the actual component without redirecting anywhere else
  console.log("User authenticated and meets role requirements");
  return <>{element || children}</>;
};

export default ProtectedRoute;
