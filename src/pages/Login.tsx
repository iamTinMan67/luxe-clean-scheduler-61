
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm"; // Import the new SignUpForm
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // New state for toggling between login and sign-up
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Check if we're in a password reset flow when component mounts
  useEffect(() => {
    const checkForPasswordReset = async () => {
      // Check URL parameters for reset flow
      const queryParams = new URLSearchParams(window.location.search);
      const resetRequested = queryParams.get('reset') === 'true';
      
      // Check for Supabase auth hash parameter which indicates a password reset link was clicked
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      const type = hashParams.get('type');
      
      if (type === 'recovery') {
        console.log("Password reset flow detected");
        setIsPasswordReset(true);
        
        // Show toast to guide the user
        toast.info("Password Reset", {
          description: "Please enter your new password below",
          duration: 5000
        });
      } else if (resetRequested) {
        // If just the reset=true param is present, show the dialog
        setIsResetOpen(true);
      }
    };
    
    checkForPasswordReset();
  }, [location]);

  // Handle password update submission
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError(null);
    
    try {
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }
      
      setResetSuccess(true);
      toast.success("Password updated successfully!", {
        description: "You can now log in with your new password"
      });
      
      // Clear the recovery hash from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // After a delay, switch to login view
      setTimeout(() => {
        setIsPasswordReset(false);
      }, 2000);
    } catch (error: any) {
      console.error("Password update failed:", error);
      setResetError(error.message);
      toast.error("Password update failed", {
        description: error.message
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Don't render the page content until we know if we're loading
  // This prevents the flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
      </div>
    );
  }

  // If user is already logged in and has appropriate role, don't show login screen
  if (user && !isPasswordReset) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <CheckCircle2 className="mx-auto h-12 w-12 text-gold mb-4" />
          <h2 className="text-2xl font-bold mb-2">Already Logged In</h2>
          <p className="text-gray-400">You are already logged in to the system.</p>
        </div>
        <Button 
          onClick={() => window.location.href = '/'}
          className="gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
        >
          Go to Home
        </Button>
      </div>
    );
  }

  // Toggle between login and sign-up forms
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-4">
            {isPasswordReset 
              ? "Reset Your Password" 
              : isSignUp 
                ? "Create An Account"
                : "Staff Login"}
          </h1>
          <p className="text-gray-300">
            {isPasswordReset 
              ? "Please enter a new password for your account" 
              : isSignUp 
                ? "Sign up to access the management system"
                : "Sign in to access the admin dashboard"}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800"
        >
          {isPasswordReset ? (
            // Password Reset Form
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              {resetError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-400">{resetError}</p>
                </div>
              )}
              
              {resetSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-400">Password updated successfully! You can now log in with your new password.</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={isResetting || resetSuccess}
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
                disabled={isResetting || resetSuccess}
              >
                {isResetting ? "Updating..." : "Update Password"}
              </Button>
              
              {!resetSuccess && (
                <div className="mt-6 text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsPasswordReset(false);
                      // Clear the recovery hash from the URL
                      window.history.replaceState({}, document.title, window.location.pathname);
                    }}
                    className="text-gold hover:underline focus:outline-none"
                  >
                    Cancel and return to login
                  </button>
                </div>
              )}
            </form>
          ) : isSignUp ? (
            // Sign Up Form
            <SignUpForm toggleMode={toggleAuthMode} />
          ) : (
            // Login Form
            <LoginForm openResetDialog={() => setIsResetOpen(true)} toggleMode={toggleAuthMode} />
          )}
        </motion.div>
      </div>
      
      {/* Password Reset Dialog */}
      <PasswordResetDialog 
        isOpen={isResetOpen}
        onOpenChange={setIsResetOpen}
      />
    </div>
  );
};

export default Login;
