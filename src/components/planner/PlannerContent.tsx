
import React from "react";
import { motion } from "framer-motion";
import PendingBookingsList from './PendingBookingsList';
import DailyPlanner from './DailyPlanner';
import WeeklyPlanner from './WeeklyPlanner';
import MonthlyPlanner from './MonthlyPlanner';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { Booking } from '@/types/booking';
import { toast } from "sonner";

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
  // Enhanced confirmation handler with notification
  const handleConfirmWithNotification = (bookingId: string, selectedStaff: string[], travelMinutes: number) => {
    handleConfirmBooking(bookingId, selectedStaff, travelMinutes);
    
    // Find the booking that was just confirmed
    const booking = pendingBookings.find(b => b.id === bookingId);
    if (booking) {
      toast.success("Booking Confirmed", {
        description: `${booking.customer}'s booking has been confirmed and added to the schedule.`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Pending Bookings List - Now placed above view-specific planners */}
      <PendingBookingsList 
        pendingBookings={pendingBookings}
        handleConfirmBooking={handleConfirmWithNotification}
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
