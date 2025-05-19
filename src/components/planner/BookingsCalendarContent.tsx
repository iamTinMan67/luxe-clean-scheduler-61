
import React from 'react';
import { Booking } from '@/types/booking';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import EmptyCalendarView from './calendar/EmptyCalendarView';
import DailyCalendarView from './calendar/DailyCalendarView';
import WeeklyMonthlyView from './calendar/WeeklyMonthlyView';

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
  // Only show confirmed bookings
  const confirmedBookingsForDate = bookingsForDate.filter(booking => 
    booking.status === 'confirmed' || 
    booking.status === 'in-progress' || 
    booking.status === 'completed');
  
  if (!date) {
    return <EmptyCalendarView message="Please select a date to view bookings" />;
  }
  
  // If daily view, show time slots horizontally
  if (view === 'daily') {
    return (
      <DailyCalendarView 
        bookings={confirmedBookingsForDate}
        onCompleteBooking={onCompleteBooking}
        onReschedule={onReschedule}
        onDeleteBooking={onDeleteBooking}
        onUpdateStatus={onUpdateStatus}
        onPackageChange={onPackageChange}
      />
    );
  }
  
  // For weekly and monthly views
  return (
    <WeeklyMonthlyView 
      bookings={confirmedBookingsForDate}
      view={view as 'weekly' | 'monthly'}
      date={date}
      onCompleteBooking={onCompleteBooking}
      onReschedule={onReschedule}
      onDeleteBooking={onDeleteBooking}
      onPackageChange={onPackageChange}
    />
  );
};

export default BookingsCalendarContent;
