
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to create an initial admin account
export const createInitialAdmin = async (email: string, password: string, firstName: string, lastName: string) => {
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
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (signUpError) {
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
    toast.info("No admin accounts exist yet", {
      description: "Please create the first admin account by signing up",
      duration: 6000
    });
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
