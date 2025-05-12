
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { useAuth } from "@/context/AuthContext";
import { initializeAdminUser } from "@/utils/authUtils";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check for admin accounts on component mount
  useEffect(() => {
    initializeAdminUser();
    
    // If already logged in, redirect to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
