
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Booking } from '@/types/booking';
import { staffMembers } from '@/data/staffData';

interface StaffAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirm: (booking: Booking, selectedStaff: string[], travelMinutes: number) => void;
}

const StaffAllocationDialog: React.FC<StaffAllocationDialogProps> = ({ 
  open, 
  onClose, 
  booking, 
  onConfirm 
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [travelMinutes, setTravelMinutes] = useState<number>(15);
  
  const handleStaffToggle = (staffName: string) => {
    if (selectedStaff.includes(staffName)) {
      setSelectedStaff(selectedStaff.filter(staff => staff !== staffName));
    } else {
      setSelectedStaff([...selectedStaff, staffName]);
    }
  };
  
  const handleConfirm = () => {
    if (!booking) return;
    
    if (selectedStaff.length === 0) {
      alert("Please select at least one staff member");
      return;
    }
    
    onConfirm(booking, selectedStaff, travelMinutes);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Allocate Staff & Travel Time</DialogTitle>
          <DialogDescription className="text-gray-400">
            {booking ? `Assign staff members to booking #${booking.id} for ${booking.customer}` : 'Loading booking...'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Select Staff Members</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-800 rounded-md">
              {staffMembers.map((staff) => (
                <div 
                  key={staff.id} 
                  className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded cursor-pointer"
                  onClick={() => handleStaffToggle(staff.name)}
                >
                  <input 
                    type="checkbox" 
                    id={`staff-${staff.id}`} 
                    checked={selectedStaff.includes(staff.name)}
                    onChange={() => handleStaffToggle(staff.name)}
                    className="rounded text-gold" 
                  />
                  <label 
                    htmlFor={`staff-${staff.id}`} 
                    className="text-white cursor-pointer flex-grow"
                  >
                    {staff.name}
                    {staff.specialty && (
                      <span className="text-xs text-gray-400 block">
                        {staff.specialty}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="travel-time" className="text-white block mb-2">
              Travel Time (minutes)
            </Label>
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => setTravelMinutes(Math.max(0, travelMinutes - 5))}
              >
                -
              </Button>
              <Input 
                id="travel-time"
                type="number" 
                value={travelMinutes} 
                onChange={(e) => setTravelMinutes(parseInt(e.target.value) || 0)}
                min="0"
                max="120"
                className="bg-gray-900 border-gray-700 text-white text-center w-20" 
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => setTravelMinutes(Math.min(120, travelMinutes + 5))}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-gold hover:bg-gold/80 text-black"
            disabled={selectedStaff.length === 0}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffAllocationDialog;
