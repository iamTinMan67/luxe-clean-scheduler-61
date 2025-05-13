
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/login/LoginForm";
import SignUpForm from "@/components/auth/login/SignUpForm";
import PasswordResetDialog from "@/components/auth/password/PasswordResetDialog";
import PasswordResetForm from "@/components/auth/password/PasswordResetForm";
import AlreadyLoggedIn from "@/components/auth/status/AlreadyLoggedIn";
import { usePasswordReset } from "@/hooks/usePasswordReset";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user, isLoading } = useAuth();
  const { isResetOpen, setIsResetOpen, isPasswordReset, setIsPasswordReset } = usePasswordReset();

  // Toggle between login and sign-up forms
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
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
    return <AlreadyLoggedIn />;
  }

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
            <PasswordResetForm onCancelReset={() => setIsPasswordReset(false)} />
          ) : isSignUp ? (
            <SignUpForm toggleMode={toggleAuthMode} />
          ) : (
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
