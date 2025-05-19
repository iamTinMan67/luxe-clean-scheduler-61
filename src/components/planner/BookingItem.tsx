
import React from 'react';
import { Booking } from '@/types/booking';
import BookingHeader from './BookingHeader';
import BookingDetails from './BookingDetails';
import BookingActions from './BookingActions';

interface BookingItemProps {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onComplete: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  onConfirm, 
  onComplete, 
  onDelete, 
  onPackageChange, 
  onReschedule 
}) => {
  return (
    <div 
      className={`border ${
        booking.status === "pending" ? "border-amber-500" : 
        booking.status === "completed" ? "border-green-500" : "border-gold"
      } rounded-md p-3 bg-black/40`}
    >
      <BookingHeader 
        booking={booking} 
        onPackageChange={onPackageChange} 
        onReschedule={onReschedule} 
        onDelete={onDelete} 
      />
      
      <BookingDetails booking={booking} />
      
      <BookingActions 
        booking={booking} 
        onConfirm={onConfirm} 
        onComplete={onComplete} 
      />
    </div>
  );
};

export default BookingItem;
