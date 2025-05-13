
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useAuthManagement = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Function to update user profile
  const updateProfile = async (userData: { display_name?: string }) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: userData.display_name })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', { 
        description: error.message 
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setIsLoading(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Update to the new password
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password', { 
        description: error.message 
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateProfile,
    changePassword
  };
};
