
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PasswordResetFormProps {
  onCancelReset: () => void;
}

const PasswordResetForm = ({ onCancelReset }: PasswordResetFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

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
        onCancelReset();
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

  return (
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
              onCancelReset();
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
  );
};

export default PasswordResetForm;
