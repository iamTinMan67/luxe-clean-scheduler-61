
import React from 'react';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import { useBookingStateManager } from "@/hooks/bookings/useBookingStateManager";
import { toast } from "sonner";
import BookingCard from './schedule-day/BookingCard';

interface ScheduleDayProps {
  date: Date;
  bookings: Booking[];
  getBookingBackground: (booking: Booking) => string;
  onBookingUpdate?: (booking: Booking) => void;
  onBookingDelete?: (bookingId: string) => void;
}

const ScheduleDay: React.FC<ScheduleDayProps> = ({ 
  date, 
  bookings, 
  getBookingBackground, 
  onBookingUpdate, 
  onBookingDelete 
}) => {
  // Sort bookings by time
  const sortedBookings = [...bookings].sort((a, b) => {
    const timeA = a.startTime || a.time || '00:00';
    const timeB = b.startTime || b.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Booking management hooks
  const { updateBooking, deleteBooking } = useBookingStateManager();

  // Handle rescheduling
  const handleReschedule = async (booking: Booking, newDate: Date, newTime?: string) => {
    const updatedBooking = {
      ...booking,
      date: newDate,
      time: newTime || booking.time,
      startTime: newTime || booking.startTime
    };
    
    await updateBooking(updatedBooking);
    if (onBookingUpdate) {
      onBookingUpdate(updatedBooking);
    }
    toast.success(`${booking.customer}'s appointment has been rescheduled`);
  };

  // Handle deletion
  const handleDelete = async (booking: Booking) => {
    await deleteBooking(booking);
    if (onBookingDelete) {
      onBookingDelete(booking.id);
    }
    toast.success(`${booking.customer}'s appointment has been deleted`);
  };

  return (
    <div className="col-span-1">
      <div className="text-center mb-3 py-2 border-b border-gray-800">
        <p className="text-gray-400 text-sm">{format(date, "EEEE")}</p>
        <h3 className="text-white font-bold">{format(date, "MMMM d, yyyy")}</h3>
      </div>

      {sortedBookings.length > 0 ? (
        <div className="space-y-3">
          {sortedBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              backgroundClass={getBookingBackground(booking)}
              onReschedule={handleReschedule}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="h-32 border border-gray-800 border-dashed rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">No bookings</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleDay;
