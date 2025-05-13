
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to create an initial admin account
export const createInitialAdmin = async (email: string, password: string, displayName: string) => {
  try {
    // First check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking for existing admins:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // If admins already exist, don't create another initial admin
    if (existingAdmins && existingAdmins.length > 0) {
      return { success: false, error: 'An admin account already exists' };
    }
    
    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
    
    if (signUpError) {
      if (signUpError.message === 'Signups not allowed for this instance') {
        return { success: false, error: 'Signups not allowed for this instance' };
      }
      throw signUpError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed');
    }
    
    // Set the user's role to admin
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authData.user.id);
    
    if (roleError) {
      throw roleError;
    }
    
    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Error creating initial admin:', error);
    return { success: false, error: error.message };
  }
};

// Initialize an admin user account
export const initializeAdminUser = async () => {
  try {
    // Check if admin user exists in profiles table
    const { data: adminProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (profilesError) {
      console.error('Error checking admin profiles:', profilesError);
      return { success: false, error: profilesError.message };
    }

    // If no admin exists, prompt creation of a first admin account
    if (!adminProfiles || adminProfiles.length === 0) {
      console.log('No admin accounts found. Please create an admin account.');
      toast.info("No admin accounts exist yet", {
        description: "Please contact the system administrator",
        duration: 6000
      });
      
      // We're removing the test account creation to prevent dummy accounts
      return { success: true, noAdmin: true };
    }
    
    return { success: true, data: adminProfiles };
  } catch (error: any) {
    console.error('Error in initializeAdminUser:', error);
    return { success: false, error: error.message };
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
