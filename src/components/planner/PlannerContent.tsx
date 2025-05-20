
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PendingBookingsList from './PendingBookingsList';
import WeeklyPlanner from './WeeklyPlanner';
import MonthlyPlanner from './MonthlyPlanner';
import DailyPlanner from './DailyPlanner';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { Booking } from '@/types/booking';

interface PlannerContentProps {
  date: Date;
  setDate: (date: Date) => void;
  view: PlannerViewType;
  setView: (view: PlannerViewType) => void;
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
  setView,
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
      
      {/* View selector buttons */}
      <div className="flex justify-center my-4">
        <div className="flex items-center rounded-md border border-gray-800">
          <Button
            variant="ghost"
            className={`text-white hover:text-gold ${view === 'daily' ? 'bg-gray-800' : ''}`}
            onClick={() => setView('daily')}
          >
            Daily
          </Button>
          <Button
            variant="ghost"
            className={`text-white hover:text-gold ${view === 'weekly' ? 'bg-gray-800' : ''}`}
            onClick={() => setView('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant="ghost"
            className={`text-white hover:text-gold ${view === 'monthly' ? 'bg-gray-800' : ''}`}
            onClick={() => setView('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>
      
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
