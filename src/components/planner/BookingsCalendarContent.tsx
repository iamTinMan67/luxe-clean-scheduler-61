
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Booking } from '@/types/booking';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingItem from './BookingItem';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

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
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-600">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-600">Confirmed</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-600">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'finished':
        return <Badge className="bg-gold">Finished</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-black/30 border border-gold/30 rounded-md p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">
          {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
        </h2>
        <div className="text-sm text-gold/70">
          {bookingsForDate.length === 0
            ? 'No bookings scheduled'
            : `${bookingsForDate.length} booking${bookingsForDate.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {date && (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {bookingsForDate.length > 0 ? (
              bookingsForDate.map((booking) => (
                <div key={booking.id} className="relative">
                  <div className="absolute top-3 right-3">
                    {renderStatus(booking.status)}
                  </div>
                  <BookingItem
                    booking={booking}
                    onConfirm={onConfirmBooking}
                    onComplete={onCompleteBooking}
                    onDelete={onDeleteBooking}
                    onPackageChange={onPackageChange}
                    onReschedule={onReschedule}
                    onUpdateStatus={onUpdateStatus}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No bookings for this date</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default BookingsCalendarContent;
