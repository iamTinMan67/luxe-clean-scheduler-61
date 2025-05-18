
import React from "react";
import { motion } from "framer-motion";
import PendingBookingsList from './PendingBookingsList';
import DailyPlanner from './DailyPlanner';
import WeeklyPlanner from './WeeklyPlanner';
import MonthlyPlanner from './MonthlyPlanner';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { Booking } from '@/types/booking';

interface PlannerContentProps {
  date: Date;
  setDate: (date: Date) => void;
  view: PlannerViewType;
  pendingBookings: Booking[];
  confirmedBookings: Booking[];
  schedule: Array<{date: Date, bookings: Booking[]}>;
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  hasBookingsOnDate: (date: Date) => boolean;
  checkTimeConflict: (date: Date, time: string) => boolean;
}

const PlannerContent: React.FC<PlannerContentProps> = ({
  date,
  setDate,
  view,
  pendingBookings,
  confirmedBookings,
  schedule,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground,
  hasBookingsOnDate,
  checkTimeConflict
}) => {
  return (
    <div className="container mx-auto px-4">
      {/* Pending Bookings List */}
      <PendingBookingsList 
        pendingBookings={pendingBookings}
        handleConfirmBooking={handleConfirmBooking}
        handleCancelBooking={handleCancelBooking}
        getBookingBackground={getBookingBackground}
      />
      
      {/* View Specific Planners */}
      {view === "daily" && (
        <DailyPlanner
          date={date}
          setDate={setDate}
          schedule={schedule}
          getBookingBackground={getBookingBackground}
        />
      )}
      
      {view === "weekly" && (
        <WeeklyPlanner
          date={date}
          setDate={setDate}
          schedule={schedule}
          getBookingBackground={getBookingBackground}
          checkTimeConflict={checkTimeConflict}
        />
      )}
      
      {view === "monthly" && (
        <MonthlyPlanner
          date={date}
          setDate={setDate}
          schedule={schedule}
          getBookingBackground={getBookingBackground}
          hasBookingsOnDate={hasBookingsOnDate}
        />
      )}
    </div>
  );
};

export default PlannerContent;
