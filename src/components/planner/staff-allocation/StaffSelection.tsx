
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffMember } from '@/data/staffData';

interface StaffSelectionProps {
  staffMembers: StaffMember[];
  selectedStaff: string[];
  onStaffToggle: (staffName: string) => void;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({ 
  staffMembers, 
  selectedStaff, 
  onStaffToggle 
}) => {
  return (
    <div>
      <Label className="text-white mb-2 block">Select staff members:</Label>
      <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/40 rounded-md">
        {staffMembers.map(staff => (
          <div key={staff.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`staff-${staff.id}`} 
              checked={selectedStaff.includes(staff.name)}
              onCheckedChange={() => onStaffToggle(staff.name)}
              className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <Label 
              htmlFor={`staff-${staff.id}`}
              className="text-white cursor-pointer"
            >
              {staff.name} ({staff.position})
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSelection;
