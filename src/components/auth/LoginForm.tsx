
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { cleanupAuthState } from "@/utils/authCleanup";

interface LoginFormProps {
  toggleMode: () => void;
  openResetDialog: () => void;
}

const LoginForm = ({ toggleMode, openResetDialog }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      // Try global sign out first to clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Sign in existing user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Logged in successfully!");
      
      // Use location.href for a full page refresh to ensure clean state
      window.location.href = "/";
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage(error.message || "Authentication failed");
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}
    
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
          className="text-sm text-gold hover:underline focus:outline-none"
        >
          Forgot password?
        </button>
      </div>
      
      <Button 
        type="submit" 
        className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Sign In"}
      </Button>
      
      <div className="mt-6 text-center">
        <button 
          type="button"
          onClick={toggleMode}
          className="text-gold hover:underline focus:outline-none"
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
