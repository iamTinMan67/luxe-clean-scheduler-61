
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { staffMembers } from "@/data/staffData";
import { Booking } from '@/types/booking';
import { toast } from "sonner";

// Import our new components
import DialogHeader from './staff-allocation/DialogHeader';
import BookingInfo from './staff-allocation/BookingInfo';
import StaffSelection from './staff-allocation/StaffSelection';
import TravelTimeInput from './staff-allocation/TravelTimeInput';
import DialogActions from './staff-allocation/DialogActions';

interface StaffAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirm: (booking: Booking, selectedStaff: string[], travelMinutes: number) => void;
  estimatedDuration?: number;
  defaultStaff?: string[];
}

const StaffAllocationDialog: React.FC<StaffAllocationDialogProps> = ({
  open,
  onClose,
  booking,
  onConfirm,
  estimatedDuration = 0,
  defaultStaff = []
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [travelTime, setTravelTime] = useState<number>(15); // Default 15 minutes travel time
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // Initialize with default staff if provided
      setSelectedStaff(defaultStaff);
      setTravelTime(15);
    }
  }, [open, defaultStaff]);
  
  const handleStaffToggle = (staffName: string) => {
    setSelectedStaff(prev => {
      if (prev.includes(staffName)) {
        return prev.filter(name => name !== staffName);
      } else {
        return [...prev, staffName];
      }
    });
  };
  
  const handleConfirm = () => {
    if (selectedStaff.length === 0) {
      toast.error("Please select at least one staff member");
      return;
    }
    
    onConfirm(booking, selectedStaff, travelTime);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-gold/30 sm:max-w-md">
        <DialogHeader title="Assign Staff Members" />
        
        <div className="py-4">
          <BookingInfo booking={booking} estimatedDuration={estimatedDuration} />
          
          <div className="space-y-4">
            <StaffSelection 
              staffMembers={staffMembers}
              selectedStaff={selectedStaff}
              onStaffToggle={handleStaffToggle}
            />
            
            <TravelTimeInput 
              travelTime={travelTime}
              onTravelTimeChange={setTravelTime}
            />
          </div>
        </div>
        
        <DialogActions 
          onCancel={onClose}
          onConfirm={handleConfirm}
          isConfirmDisabled={selectedStaff.length === 0}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StaffAllocationDialog;
