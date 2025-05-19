
import React from 'react';
import { Button } from "@/components/ui/button";
import { Booking } from '@/types/booking';

interface BookingActionsProps {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
}

const BookingActions: React.FC<BookingActionsProps> = ({ booking, onConfirm, onComplete }) => {
  return (
    <div className="mt-3 flex gap-2">
      {booking.status === "pending" && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onConfirm(booking)}
        >
          Confirm Booking
        </Button>
      )}
      
      {booking.status === "confirmed" && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onComplete(booking)}
        >
          Mark as Completed
        </Button>
      )}
    </div>
  );
};

export default BookingActions;
