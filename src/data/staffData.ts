
export interface StaffMember {
  id: string;
  name: string;
  position?: string;
  specialty?: string;
  availability?: string[];
}

export const staffMembers: StaffMember[] = [
  { id: "1", name: "John Smith", position: "Senior Detailer", specialty: "Paint Correction" },
  { id: "2", name: "Sarah Johnson", position: "Detailer", specialty: "Interior Cleaning" },
  { id: "3", name: "Michael Brown", position: "Detailer", specialty: "Ceramic Coating" },
  { id: "4", name: "Emma Wilson", position: "Junior Detailer", specialty: "Wash and Wax" },
  { id: "5", name: "David Lee", position: "Detailer", specialty: "Leather Treatment" },
  { id: "6", name: "Karl", position: "Senior Detailer", specialty: "Exterior Detailing" },
  { id: "7", name: "Salleah", position: "Lead Detailer", specialty: "Full Vehicle Detailing" }
];

// Helper function to get staff names only
export const getStaffNames = (): string[] => {
  return staffMembers.map(staff => staff.name);
};

// Helper function to find a staff member by name
export const findStaffMemberByName = (name: string): StaffMember | undefined => {
  return staffMembers.find(staff => staff.name === name);
};
