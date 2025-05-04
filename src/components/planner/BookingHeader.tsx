
import React from 'react';
import { Booking } from '@/types/booking';
import EditPackageDialog from './dialogs/EditPackageDialog';
import RescheduleDialog from './dialogs/RescheduleDialog';
import DeleteBookingDialog from './dialogs/DeleteBookingDialog';

interface BookingHeaderProps {
  booking: Booking;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
  onDelete: (booking: Booking) => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ 
  booking, 
  onPackageChange, 
  onReschedule, 
  onDelete 
}) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-white font-medium">{booking.customer}</p>
        <p className="text-gold text-sm">{booking.time || "No time specified"}</p>
      </div>
      <div className="flex gap-2">
        <EditPackageDialog booking={booking} onPackageChange={onPackageChange} />
        <RescheduleDialog booking={booking} onReschedule={onReschedule} />
        <DeleteBookingDialog booking={booking} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default BookingHeader;
