
import React from 'react';
import { Booking } from '@/types/booking';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingItem from './BookingItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookingsCalendarContentProps {
  date: Date | undefined;
  bookingsForDate: Booking[];
  view: PlannerViewType;
  onConfirmBooking: (booking: Booking) => void;
  onCompleteBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
}

const BookingsCalendarContent: React.FC<BookingsCalendarContentProps> = ({
  date,
  bookingsForDate,
  view,
  onConfirmBooking,
  onCompleteBooking,
  onDeleteBooking,
  onPackageChange,
  onReschedule,
  onUpdateStatus
}) => {
  // Display bookings passed in via props directly - these are only confirmed bookings now
  const filteredBookings = bookingsForDate || [];
  
  return (
    <ScrollArea className="flex-1 h-[300px]">
      <div className="p-2">
        {date ? (
          <>
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    onConfirm={onConfirmBooking}
                    onComplete={onCompleteBooking}
                    onDelete={onDeleteBooking}
                    onPackageChange={onPackageChange}
                    onReschedule={onReschedule}
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gold/70">No bookings for the selected date</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gold/70">Select a date to view bookings</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default BookingsCalendarContent;
