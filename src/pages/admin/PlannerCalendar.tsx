
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";
import { Toaster } from "@/components/ui/sonner";
import SimplePendingBookings from "@/components/planner/SimplePendingBookings";

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
          {/* Simplified pending bookings at top */}
          <SimplePendingBookings 
            pendingBookings={pendingBookings}
            handleConfirmBooking={handleConfirmBooking}
            handleCancelBooking={handleCancelBooking}
          />
          
          {/* Main planner content with the calendar and schedule view */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
            {/* Calendar panel on left */}
            <div className="col-span-1 md:col-span-5">
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
                navigatePrevious={navigatePrevious}
                navigateNext={navigateNext}
                navigateToday={navigateToday}
              />
            </div>
            
            {/* Schedule view on right */}
            <div className="col-span-1 md:col-span-7">
              <CalendarHeader 
                date={date}
                view={view}
                navigatePrevious={navigatePrevious}
                navigateNext={navigateNext}
                navigateToday={navigateToday}
                setView={setView}
                pendingBookingsCount={pendingBookings.length}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Toaster component for notifications */}
      <Toaster />
    </div>
  );
};

export default PlannerCalendar;
