
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";

const PlannerCalendar = () => {
  // Force re-render on mount to ensure latest data is loaded
  const [key, setKey] = useState(0);

  useEffect(() => {
    // This will force the component to re-render on mount
    // which will reload all bookings from localStorage
    setKey(prev => prev + 1);
  }, []);

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
    checkTimeConflict
  } = usePlannerCalendar();

  return (
    <div className="min-h-screen bg-black pb-16" key={key}>
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
          
          {/* Main planner content */}
          <PlannerContent
            date={date}
            setDate={setDate}
            view={view}
            pendingBookings={pendingBookings}
            confirmedBookings={confirmedBookings}
            schedule={schedule}
            handleConfirmBooking={handleConfirmBooking}
            handleCancelBooking={handleCancelBooking}
            getBookingBackground={getBookingBackground}
            hasBookingsOnDate={hasBookingsOnDate}
            checkTimeConflict={checkTimeConflict}
          />
        </div>
      </section>
      
      {/* Add Toaster component for notifications */}
      <Toaster />
    </div>
  );
};

export default PlannerCalendar;
