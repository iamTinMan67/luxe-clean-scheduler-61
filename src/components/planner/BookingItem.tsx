
import React from 'react';
import { Booking } from '@/types/booking';
import BookingHeader from './BookingHeader';
import BookingDetails from './BookingDetails';
import BookingActions from './BookingActions';
import { getStatusInfo } from '@/utils/statusUtils';

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
  // Get status info for styling
  const statusInfo = getStatusInfo(booking.status);

  return (
    <div 
      className={`border ${statusInfo.color} rounded-md p-3 bg-black/40`}
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
