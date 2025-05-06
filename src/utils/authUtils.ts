
import { supabase } from "@/integrations/supabase/client";

// Initialize an admin user account
export const initializeAdminUser = async () => {
  // Check if admin user exists in profiles table
  const { data: adminProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  if (profilesError) {
    console.error('Error checking admin profiles:', profilesError);
    return;
  }

  // If no admin exists, prompt creation of a first admin account
  if (!adminProfiles || adminProfiles.length === 0) {
    console.log('No admin accounts found. Please create an admin account through the signup process.');
    
    // In a complete implementation, you would add code here to guide admin creation
    // For now, we'll just log instructions
  }
};

// Set a user's role (admin, staff, customer)
export const setUserRole = async (userId: string, role: 'admin' | 'staff' | 'customer') => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error setting user role:', error);
    return { success: false, error: error.message };
  }
};
