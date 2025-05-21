
import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, CalendarClock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Booking } from '@/types/booking';
import StaffAllocationDialog from '../StaffAllocationDialog';
import RescheduleDialog from '../dialogs/RescheduleDialog';
import { staffMembers } from "@/data/staffData";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface BookingActionsProps {
  booking: Booking;
  onConfirm: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  onCancel: (bookingId: string) => void;
  estimatedDuration: number;
}

const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  onConfirm,
  onCancel,
  estimatedDuration
}) => {
  const [showStaffDialog, setShowStaffDialog] = useState(false);

  // Get default staff (first two staff members)
  const defaultStaff = staffMembers.slice(0, 2).map(staff => staff.name);
  
  const handleConfirmClick = () => {
    // If there are more than 2 staff members, show the dialog
    if (staffMembers.length > 2) {
      setShowStaffDialog(true);
    } else {
      // Otherwise, directly confirm with the default staff
      onConfirm(booking.id, defaultStaff, 15);
    }
  };

  const handleStaffConfirm = (booking: Booking, selectedStaff: string[], travelMinutes: number) => {
    onConfirm(booking.id, selectedStaff, travelMinutes);
  };

  // Function to handle rescheduling
  const handleReschedule = (booking: Booking, newDate: Date, newTime?: string) => {
    // This would typically update the booking in a real implementation
    console.log("Booking rescheduled:", booking.id, newDate, newTime);
    // For now, we'll just log it since we don't have a direct reschedule function passed down
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleConfirmClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Schedule
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-gray-700">
            <p>Schedule this booking and assign staff members</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Add Reschedule Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <RescheduleDialog 
              booking={booking}
              onReschedule={handleReschedule}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-gray-700">
            <p>Change the date or time for this booking</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => onCancel(booking.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              variant="destructive"
              size="sm"
            >
              <AlertCircle className="w-4 h-4 mr-1" /> Decline
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white border-gray-700">
            <p>Cancel this booking request</p>
          </TooltipContent>
        </Tooltip>

        {/* Only show staff dialog if there are more than 2 staff members */}
        {staffMembers.length > 2 && (
          <StaffAllocationDialog
            open={showStaffDialog}
            onClose={() => setShowStaffDialog(false)}
            booking={booking}
            onConfirm={handleStaffConfirm}
            estimatedDuration={estimatedDuration}
            defaultStaff={defaultStaff}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default BookingActions;
