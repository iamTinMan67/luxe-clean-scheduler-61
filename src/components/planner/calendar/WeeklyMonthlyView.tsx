
import React from 'react';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';
import EventCard from './EventCard';
import EmptyCalendarView from './EmptyCalendarView';

interface WeeklyMonthlyViewProps {
  bookings: Booking[];
  view: 'weekly' | 'monthly';
  date: Date;
  onCompleteBooking: (booking: Booking) => void;
  onReschedule: (booking: Booking, date: Date) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

const WeeklyMonthlyView: React.FC<WeeklyMonthlyViewProps> = ({
  bookings,
  view,
  date,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking,
  onPackageChange
}) => {
  if (bookings.length === 0) {
    return (
      <EmptyCalendarView 
        message={`No bookings scheduled for ${view === 'weekly' ? 'this week' : 'this month'}`} 
      />
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto max-h-[500px] p-2">
      <h3 className="text-lg font-semibold text-white mb-3">
        {view === 'weekly' 
          ? `Week of ${format(date, 'MMMM d, yyyy')}` 
          : `Month of ${format(date, 'MMMM yyyy')}`}
      </h3>
      {bookings.map(booking => (
        <EventCard 
          key={booking.id} 
          booking={booking}
          onCompleteBooking={onCompleteBooking}
          onReschedule={onReschedule}
          onDeleteBooking={onDeleteBooking}
          onPackageChange={onPackageChange}
        />
      ))}
    </div>
  );
};

export default WeeklyMonthlyView;
