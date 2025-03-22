
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PendingBookingsList from "@/components/planner/PendingBookingsList";
import ScheduleCalendar from "@/components/planner/ScheduleCalendar";

const PlannerCalendar = () => {
  const {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    schedule,
    navigatePrevious,
    navigateNext,
    navigateToday,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground
  } = usePlannerCalendar();

  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          {/* Calendar header with navigation */}
          <CalendarHeader 
            date={date}
            view={view}
            navigatePrevious={navigatePrevious}
            navigateNext={navigateNext}
            navigateToday={navigateToday}
            setView={setView}
            pendingBookingsCount={pendingBookings.length}
          />
          
          {/* Pending Bookings List */}
          <PendingBookingsList 
            pendingBookings={pendingBookings}
            handleConfirmBooking={handleConfirmBooking}
            handleCancelBooking={handleCancelBooking}
            getBookingBackground={getBookingBackground}
          />
          
          {/* Calendar Section */}
          <ScheduleCalendar 
            date={date}
            setDate={setDate}
            schedule={schedule}
            getBookingBackground={getBookingBackground}
          />
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
