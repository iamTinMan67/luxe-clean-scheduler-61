
import React from 'react';
import { Booking } from '@/types/booking';
import { Button } from '@/components/ui/button';

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
  onPackageChange
}) => {
  if (!onCompleteBooking || !onReschedule || !onDeleteBooking) {
    return null;
  }

  return (
    <div className="flex gap-1 mt-1">
      <Button 
        size="sm" 
        variant="outline" 
        className="h-6 text-[10px] px-1 py-0 bg-green-900/30 border-green-600/50 text-green-300 hover:bg-green-800/50"
        onClick={(e) => {
          e.stopPropagation();
          onCompleteBooking(booking);
        }}
      >
        Complete
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="h-6 text-[10px] px-1 py-0 bg-blue-900/30 border-blue-600/50 text-blue-300 hover:bg-blue-800/50"
        onClick={(e) => {
          e.stopPropagation();
          onReschedule(booking, new Date(booking.date));
        }}
      >
        Reschedule
      </Button>
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
