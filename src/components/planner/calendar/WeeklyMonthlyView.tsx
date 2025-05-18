
import React from 'react';
import { Booking } from '@/types/booking';
import EventCard from './EventCard';
import EmptyCalendarView from './EmptyCalendarView';

interface WeeklyMonthlyViewProps {
  bookings: Booking[];
  view: 'weekly' | 'monthly';
  date: Date;
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
}

const WeeklyMonthlyView: React.FC<WeeklyMonthlyViewProps> = ({
  bookings,
  view,
  date,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking
}) => {
  if (bookings.length === 0) {
    return <EmptyCalendarView view={view} />;
  }

  return (
    <div className="flex-1 overflow-y-auto max-h-[500px]">
      {bookings.map(booking => (
        <EventCard
          key={booking.id}
          booking={booking}
          onCompleteBooking={onCompleteBooking}
          onReschedule={onReschedule}
          onDeleteBooking={onDeleteBooking}
        />
      ))}
    </div>
  );
};

export default WeeklyMonthlyView;
