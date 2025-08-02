
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";

const PlannerCalendar = () => {
  // No longer need force re-render hack - unified bookings handle state properly

  const {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    confirmedBookings,
    schedule,
    navigatePrevious,
    navigateNext,
    navigateToday,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground,
    hasBookingsOnDate,
    checkTimeConflict,
    conflictCount
  } = usePlannerCalendar();

  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link 
              to="/admin/planning" 
              className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Planning</span>
            </Link>
          </div>

          {/* Calendar header with navigation */}
          <CalendarHeader 
            date={date}
            view={view}
            setView={setView}
            pendingBookingsCount={pendingBookings.length}
          />
          
          {/* Main planner content */}
          <PlannerContent
            date={date}
            setDate={setDate}
            view={view}
            setView={setView}
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            schedule={schedule}
            handleConfirmBooking={handleConfirmBooking}
            handleCancelBooking={handleCancelBooking}
            getBookingBackground={getBookingBackground}
            hasBookingsOnDate={hasBookingsOnDate}
            checkTimeConflict={checkTimeConflict}
            navigatePrevious={navigatePrevious}
            navigateNext={navigateNext}
            navigateToday={navigateToday}
            conflictCount={conflictCount}
          />
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
