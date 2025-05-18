
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
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ 
  booking, 
  onConfirm, 
  onComplete, 
  onDelete, 
  onPackageChange, 
  onReschedule,
  onUpdateStatus
}) => {
  // Get the border color based on status
  const getBorderColor = () => {
    switch (booking.status) {
      case "pending": return "border-amber-500";
      case "confirmed": return "border-blue-500";
      case "in-progress": return "border-purple-500";
      case "completed": return "border-green-500";
      case "finished": return "border-gold";
      default: return "border-gray-500";
    }
  };

  return (
    <div 
      className={`border ${getBorderColor()} rounded-md p-3 bg-black/40`}
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
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};

export default BookingItem;
