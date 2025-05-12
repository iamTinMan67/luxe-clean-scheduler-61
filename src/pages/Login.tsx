
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { useAuth } from "@/context/AuthContext";
import { initializeAdminUser } from "@/utils/authUtils";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [signupsDisabled, setSignupsDisabled] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check for admin accounts on component mount
  useEffect(() => {
    const checkAdminAndSupabaseStatus = async () => {
      try {
        // Check if Supabase signup is disabled by attempting to read a profile
        const { data: testData, error: testError } = await initializeAdminUser();
        
        // Check for the specific signup_disabled code in the error
        if (testError === 'Signups not allowed for this instance') {
          console.error('Supabase signups are disabled. Please enable them in the Supabase dashboard.');
          setSignupsDisabled(true);
          toast.error('Account creation is disabled', {
            description: 'The administrator has disabled new account creation.'
          });
        }
      } catch (err) {
        console.error('Error checking Supabase status:', err);
      }
    };
    
    checkAdminAndSupabaseStatus();
    
    // If already logged in, redirect to home
    if (user && !isLoading) {
      console.log('User already logged in, redirecting to home');
      navigate("/");
    }
  }, [user, navigate, isLoading]);

  const toggleMode = () => {
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
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-300">
            {isSignUp 
              ? "Sign up to access Mid-Cheshire Valeting services" 
              : "Sign in to your account to manage your bookings"}
          </p>
        </motion.div>
        
        {signupsDisabled && isSignUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-6 bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-400">Signup Disabled</h3>
              <p className="text-sm text-red-300">
                New account creation is currently disabled. Please contact the administrator or try logging in with an existing account.
              </p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="text-sm text-gold mt-2 hover:underline"
              >
                Go to login
              </button>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800"
        >
          {isSignUp ? (
            <SignUpForm toggleMode={toggleMode} />
          ) : (
            <LoginForm 
              toggleMode={toggleMode} 
              openResetDialog={() => setIsResetOpen(true)}
            />
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
