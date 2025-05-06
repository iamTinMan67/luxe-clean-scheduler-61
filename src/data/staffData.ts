
import { supabase } from "@/integrations/supabase/client";

export interface StaffMember {
  id: string;
  name: string;
  position?: string;
  specialty?: string;
  availability?: string[];
}

export const staffMembers: StaffMember[] = [
  { id: "1", name: "Karl", position: "Senior Detailer", specialty: "Exterior Detailing" },
  { id: "2", name: "Salleah", position: "Lead Detailer", specialty: "Full Vehicle Detailing" }
];

// Helper function to get staff names only
export const getStaffNames = (): string[] => {
  return staffMembers.map(staff => staff.name);
};

// Helper function to find a staff member by name
export const findStaffMemberByName = (name: string): StaffMember | undefined => {
  return staffMembers.find(staff => staff.name === name);
};

// Function to fetch staff from Supabase
export const fetchStaffFromDatabase = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*');
      
    if (error) {
      console.error('Error fetching staff:', error);
      return staffMembers; // Fall back to local data if fetch fails
    }
    
    if (!data || data.length === 0) {
      // If no data in Supabase yet, use the local data and maybe initialize the database
      await initializeStaffData();
      return staffMembers;
    }
    
    return data.map(staff => ({
      id: staff.id,
      name: staff.name,
      position: staff.position,
      specialty: staff.specialty,
    }));
  } catch (err) {
    console.error('Failed to fetch staff:', err);
    return staffMembers; // Fall back to local data
  }
};

// Function to initialize staff data in Supabase
export const initializeStaffData = async (): Promise<void> => {
  try {
    const { data: existingStaff, error: fetchError } = await supabase
      .from('staff')
      .select('id');
      
    if (fetchError) {
      console.error('Error checking staff data:', fetchError);
      return;
    }
    
    // Only initialize if no staff exists
    if (!existingStaff || existingStaff.length === 0) {
      const { error: insertError } = await supabase
        .from('staff')
        .insert(staffMembers.map(staff => ({
          name: staff.name,
          position: staff.position,
          specialty: staff.specialty,
        })));
        
      if (insertError) {
        console.error('Error initializing staff data:', insertError);
      }
    }
  } catch (err) {
    console.error('Failed to initialize staff data:', err);
  }
};
