
import React from 'react';
import { Booking } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { getStatusInfo } from '@/utils/statusUtils';

interface NotificationButtonsProps {
  booking: Booking;
  onCompleteBooking?: (booking: Booking) => void;
  onReschedule?: (booking: Booking, newDate: Date) => void;
  onDeleteBooking?: (booking: Booking) => void;
  onUpdateStatus?: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

const NotificationButtons: React.FC<NotificationButtonsProps> = ({
  booking,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking,
  onUpdateStatus,
  onPackageChange
}) => {
  // Get status information for styling and next actions
  const statusInfo = getStatusInfo(booking.status);
  
  // Check if all required handlers are provided
  if (!onCompleteBooking && !onReschedule && !onDeleteBooking && !onUpdateStatus) {
    return null;
  }

  return (
    <div className="flex gap-1 mt-1">
      {/* Status update button - shows appropriate action based on current status */}
      {onUpdateStatus && statusInfo.nextStatus && (
        <Button 
          size="sm" 
          variant="outline" 
          className={`h-6 text-[10px] px-1 py-0 bg-${statusInfo.badgeColor}/30 border-${statusInfo.badgeColor}/50 ${statusInfo.textColor} hover:bg-${statusInfo.badgeColor}/50`}
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(booking, statusInfo.nextStatus as "confirmed" | "in-progress" | "completed" | "finished");
          }}
        >
          {statusInfo.nextLabel || 'Update'}
        </Button>
      )}
      
      {/* Reschedule button */}
      {onReschedule && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-[10px] px-1 py-0 bg-blue-900/30 border-blue-600/50 text-blue-300 hover:bg-blue-800/50"
          onClick={(e) => {
            e.stopPropagation();
            onReschedule(booking, booking.date instanceof Date ? booking.date : new Date(booking.date));
          }}
        >
          Reschedule
        </Button>
      )}
      
      {/* Delete button */}
      {onDeleteBooking && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-[10px] px-1 py-0 bg-red-900/30 border-red-600/50 text-red-300 hover:bg-red-800/50"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBooking(booking);
          }}
        >
          Delete
        </Button>
      )}
      
      {/* Package edit button */}
      {onPackageChange && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-[10px] px-1 py-0 bg-purple-900/30 border-purple-600/50 text-purple-300 hover:bg-purple-800/50"
          onClick={(e) => {
            e.stopPropagation();
            onPackageChange(booking, booking.packageType);
          }}
        >
          Edit
        </Button>
      )}
    </div>
  );
};

export default NotificationButtons;
