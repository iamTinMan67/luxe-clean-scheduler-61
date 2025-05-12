
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog = ({ isOpen, onOpenChange }: PasswordResetDialogProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setErrorMessage(null);
    
    try {
      // Get the current URL origin for proper redirection
      const siteUrl = window.location.origin;
      
      // We need to properly construct the redirectTo URL
      // This ensures that after password reset, users return to the login page
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${siteUrl}/login`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent!", {
        description: "Please check your email for instructions."
      });
      
      onOpenChange(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setErrorMessage(error.message || "Failed to send reset link");
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email address</Label>
            <div className="relative">
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-gray-800 border-gray-700 text-white pl-10"
                disabled={isResetting}
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all"
              disabled={isResetting}
            >
              {isResetting ? "Sending..." : "Send Reset Link"}
              {!isResetting && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
