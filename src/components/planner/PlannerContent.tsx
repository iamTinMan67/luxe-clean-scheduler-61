
import React from 'react';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import PendingBookingsList from './PendingBookingsList';
import ScheduleCalendar from './ScheduleCalendar';
import { Booking } from '@/types/booking';

interface PlannerContentProps {
  date: Date;
  setDate: (date: Date) => void;
  view: PlannerViewType;
  setView: (view: PlannerViewType) => void;
  pendingBookings: Booking[];
  confirmedBookings: Booking[];
  schedule: Record<string, any>[];
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  hasBookingsOnDate: (date: Date) => boolean;
  checkTimeConflict: (date: Date, time: string) => boolean;
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  conflictCount?: number; // New prop for conflict count
}

const PlannerContent: React.FC<PlannerContentProps> = ({
  date,
  setDate,
  view,
  setView,
  pendingBookings,
  confirmedBookings,
  schedule,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground,
  hasBookingsOnDate,
  checkTimeConflict,
  navigatePrevious,
  navigateNext,
  navigateToday,
  conflictCount = 0 // Default to 0 if not provided
}) => {
  return (
    <>
      {/* Pending Bookings List */}
      <PendingBookingsList
        pendingBookings={pendingBookings}
        handleConfirmBooking={handleConfirmBooking}
        handleCancelBooking={handleCancelBooking}
        getBookingBackground={getBookingBackground}
        conflictCount={conflictCount}
      />
      
      {/* Schedule Calendar */}
      <ScheduleCalendar 
        date={date}
        view={view}
        setView={setView}
        schedule={schedule}
        hasBookingsOnDate={hasBookingsOnDate}
        checkTimeConflict={checkTimeConflict}
        navigatePrevious={navigatePrevious}
        navigateNext={navigateNext}
        navigateToday={navigateToday}
        setDate={setDate}
      />
    </>
  );
};

export default PlannerContent;
