
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { staffMembers } from "@/data/staffData";
import { Booking } from '@/types/booking';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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
      // Use existing travel time from booking or default to 15 minutes
      setTravelTime(booking.travelMinutes || 15);
    }
  }, [open, defaultStaff, booking.travelMinutes]);
  
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

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : hours === 0 ? '0m' : ''}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-gold/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Assign Staff Members</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <p className="text-gray-300">
              Booking for: <span className="text-white font-medium">{booking.customer}</span>
            </p>
            <p className="text-gray-300">
              Package: <span className="text-white">{booking.packageType}</span>
            </p>
            <p className="text-gray-300">
              Estimated service time: <span className="text-white font-medium">{formatDuration(estimatedDuration)}</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Select staff members:</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-black/40 rounded-md">
                {staffMembers.map(staff => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`staff-${staff.id}`} 
                      checked={selectedStaff.includes(staff.name)}
                      onCheckedChange={() => handleStaffToggle(staff.name)}
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
            
            <div>
              <Label htmlFor="travel-time" className="text-white">Travel time (minutes):</Label>
              <Input 
                id="travel-time"
                type="number"
                min="0"
                max="120"
                value={travelTime}
                onChange={(e) => setTravelTime(parseInt(e.target.value) || 15)}
                className="bg-black/40 border-gold/30 text-white"
                placeholder="15"
              />
              <p className="text-gray-400 text-sm mt-1">
                Default is 15 minutes. Adjust as needed for this booking.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-gold/30 text-white hover:bg-gold/10">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="gold-gradient text-black"
            disabled={selectedStaff.length === 0}
          >
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffAllocationDialog;
