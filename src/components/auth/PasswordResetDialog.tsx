
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
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
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setErrorMessage(null);
    setSuccess(false);
    
    try {
      console.log("Attempting password reset for:", resetEmail);
      
      // Get the current URL origin for proper redirection
      const origin = window.location.origin;
      const redirectPath = "/login?reset=true"; // Add a query param to indicate reset flow
      const redirectTo = `${origin}${redirectPath}`;
      
      console.log("Password reset will redirect to:", redirectTo);
      
      // Send password reset email with proper redirect URL
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectTo
      });
      
      if (error) {
        console.error("Password reset API error:", error);
        throw error;
      }
      
      setSuccess(true);
      toast.success("Password reset link sent!", {
        description: "Please check your email for instructions."
      });
      
      // Don't close the dialog immediately on success to let user see the success message
      setTimeout(() => {
        onOpenChange(false);
        setResetEmail("");
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setErrorMessage(error.message || "Failed to send reset link");
      toast.error("Password reset failed", {
        description: error.message || "Failed to send reset link"
      });
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
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 flex items-start">
            <ArrowRight className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-green-400">
              <p className="font-medium">Password reset link sent to your email!</p>
              <p className="mt-1">Check your inbox and spam folder. The link will expire in 24 hours.</p>
            </div>
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
              className="gold-gradient text-black hover:shadow-xl hover:shadow-gold/20 transition-all w-full sm:w-auto"
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
