
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import { sanitizeUserInput, isValidEmail } from "@/utils/inputSanitizer";
import { AuthRateLimit } from "@/utils/authRateLimit";

interface SignUpFormProps {
  toggleMode: () => void;
}

const SignUpForm = ({ toggleMode }: SignUpFormProps) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitCheck = AuthRateLimit.isBlocked(email || 'signup');
    if (rateLimitCheck.blocked) {
      toast.error("Too many attempts", {
        description: `Please wait ${rateLimitCheck.remainingTime} minutes before trying again`
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Validate and sanitize inputs
      const sanitizedDisplayName = sanitizeUserInput(displayName.trim());
      const sanitizedEmail = sanitizeUserInput(email.trim());
      
      if (!sanitizedDisplayName) {
        throw new Error("Display name is required");
      }
      
      if (!sanitizedEmail) {
        throw new Error("Email is required");
      }
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Password strength validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        throw new Error("Password must contain uppercase, lowercase, number, and special character");
      }

      // Sign up new user with metadata and redirect URL
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            display_name: sanitizedDisplayName
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;
      
      AuthRateLimit.recordAttempt(sanitizedEmail, true); // Record successful attempt
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account."
      });
      
      toggleMode(); // Switch back to sign in mode
    } catch (error: any) {
      console.error("Authentication error:", error);
      AuthRateLimit.recordAttempt(email || 'signup', false); // Record failed attempt
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display-name">Display Name</Label>
        <div className="relative">
          <Input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            required
            className="bg-gray-800 border-gray-700 text-white pl-10"
            disabled={isLoading}
          />
          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
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
            placeholder="Create a password"
            required
            className="bg-gray-800 border-gray-700 text-white pl-10"
            disabled={isLoading}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Create Account"}
      </Button>
      
      <div className="mt-6 text-center">
        <button 
          type="button"
          onClick={toggleMode}
          className="text-gold hover:underline focus:outline-none"
        >
          Already have an account? Sign In
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
