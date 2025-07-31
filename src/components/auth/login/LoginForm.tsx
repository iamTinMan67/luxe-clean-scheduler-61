
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { cleanupAuthState } from "@/utils/authCleanup";
import { sanitizeUserInput, isValidEmail } from "@/utils/inputSanitizer";
import { AuthRateLimit } from "@/utils/authRateLimit";

interface LoginFormProps {
  openResetDialog: () => void;
  toggleMode: () => void; // Added prop to toggle between login and sign-up
}

const LoginForm = ({ openResetDialog, toggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting before processing
    const rateLimitCheck = AuthRateLimit.isBlocked(email || 'login');
    if (rateLimitCheck.blocked) {
      toast.error("Too many login attempts", {
        description: `Account temporarily locked. Try again in ${rateLimitCheck.remainingTime} minutes.`
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate and sanitize input
      const sanitizedEmail = sanitizeUserInput(email.trim());
      const sanitizedPassword = password; // Don't sanitize password as it may contain special chars
      
      if (!sanitizedEmail || !sanitizedPassword) {
        throw new Error("Email and password are required");
      }
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Clean up any existing auth state before login attempt
      cleanupAuthState();
      
      // Try a global sign-out first (ignore errors)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        // Ignore any errors, just continue with sign in
        console.log("Sign out before login failed, continuing anyway");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      
      if (error) throw error;
      
      // Record successful authentication
      AuthRateLimit.recordAttempt(sanitizedEmail, true);
      
      toast.success("Login successful");
      
      // Save login info to localStorage for reference (sanitized)
      localStorage.setItem('lastSignInEmail', sanitizedEmail);
      
      // Redirect to admin dashboard after successful login
      // Use window.location to ensure a complete page refresh
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Record failed authentication attempt
      const sanitizedEmail = sanitizeUserInput(email.trim());
      AuthRateLimit.recordAttempt(sanitizedEmail, false);
      
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="bg-gray-800 border-gray-700 text-white pl-10"
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="bg-gray-800 border-gray-700 text-white pl-10"
            disabled={isLoading}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="text-right">
        <button 
          type="button" 
          onClick={openResetDialog}
          className="text-gold hover:underline text-sm focus:outline-none"
        >
          Forgot password?
        </button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
      
      <div className="mt-6 text-center">
        <button 
          type="button" 
          onClick={toggleMode}
          className="text-gold hover:underline focus:outline-none"
        >
          Need an account? Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
