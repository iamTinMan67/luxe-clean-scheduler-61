import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cleanupAuthState } from "@/utils/authCleanup";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AlreadyLoggedIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from the URL or default to dashboard
  useEffect(() => {
    // If we're already on a page (not just /login), stay there
    if (location.pathname !== '/login') {
      return;
    }
    
    // Otherwise redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/admin/dashboard');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, location.pathname]);
  
  const handleSignOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
      // Force reload even if sign out fails
      window.location.reload();
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold mb-4" />
        <h2 className="text-2xl font-bold mb-2">Already Logged In</h2>
        <p className="text-gray-400 mb-2">You are already logged in as {user?.email}.</p>
        {location.pathname === '/login' && (
          <p className="text-gray-400 mb-4">Redirecting to dashboard...</p>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="border-gold text-gold hover:bg-gold/10"
        >
          Sign in as different user
        </Button>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
