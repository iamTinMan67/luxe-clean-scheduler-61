
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
