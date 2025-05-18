
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PlannerContent from "@/components/planner/PlannerContent";
import { Card, CardContent } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import BookingsCalendar from "@/components/planner/BookingsCalendar";

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

  // Staff planner functionality
  const {
    pendingBookings: staffPendingBookings,
    confirmedBookings: staffConfirmedBookings,
    date: staffDate,
    setDate: setStaffDate,
    view: staffView,
    setView: setStaffView,
    getBookingsForDate,
    handleConfirmBooking: staffHandleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking,
    handleUpdateStatus
  } = useBookings();

  return (
    <div className="min-h-screen bg-black pb-16" key={key}>
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          {/* Calendar header - WITHOUT pending bookings count */}
          <CalendarHeader 
            date={date}
            view={view}
            navigatePrevious={navigatePrevious}
            navigateNext={navigateNext}
            navigateToday={navigateToday}
            setView={setView}
            pendingBookingsCount={0} // Set to 0 to remove notification
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
            // Pass navigation functions to be rendered below pending bookings
            navigatePrevious={navigatePrevious}
            navigateNext={navigateNext}
            navigateToday={navigateToday}
            setView={setView}
          />
          
          {/* Staff Planner section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Schedule View</h2>
            <div className="grid grid-cols-1 gap-6">
              <BookingsCalendar 
                date={staffDate}
                setDate={setStaffDate}
                view={staffView}
                setView={setStaffView}
                bookingsForDate={getBookingsForDate()}
                onConfirmBooking={staffHandleConfirmBooking}
                onCompleteBooking={handleCompleteBooking}
                onDeleteBooking={handleDeleteBooking}
                onPackageChange={handlePackageChange}
                onReschedule={handleReschedule}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
