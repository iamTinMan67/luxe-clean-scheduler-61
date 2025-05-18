
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cleanupAuthState } from "@/utils/authCleanup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AlreadyLoggedIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut();
      // Use the reload as a last resort only
      setTimeout(() => window.location.href = '/login', 100);
    } catch (error) {
      console.error("Error signing out:", error);
      // Navigate instead of reload to prevent infinite loop
      navigate('/login', { replace: true });
    }
  };
  
  const handleGotoDashboard = () => {
    navigate('/admin/dashboard', { replace: true });
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold mb-4" />
        <h2 className="text-2xl font-bold mb-2">Already Logged In</h2>
        <p className="text-gray-400 mb-2">You are already logged in as {user?.email}.</p>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleGotoDashboard}
          className="bg-gold text-black hover:bg-gold/90"
        >
          Go to Dashboard
        </Button>
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
