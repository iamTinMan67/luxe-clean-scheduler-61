
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const usePasswordReset = () => {
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
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

  return {
    isResetOpen,
    setIsResetOpen,
    isPasswordReset,
    setIsPasswordReset
  };
};
