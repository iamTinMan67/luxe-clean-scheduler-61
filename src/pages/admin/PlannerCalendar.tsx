
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar, PlannerViewType } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PendingBookingsList from "@/components/planner/PendingBookingsList";
import ScheduleCalendar from "@/components/planner/ScheduleCalendar";
import DailyPlanner from "@/components/planner/DailyPlanner";
import WeeklyPlanner from "@/components/planner/WeeklyPlanner";
import MonthlyPlanner from "@/components/planner/MonthlyPlanner";
import StaffPlanner from "@/pages/admin/StaffPlanner";

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
            hasBookingsOnDate={hasBookingsOnDate}
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
          
          {/* Staff Planner embedded directly */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Staff Planner</h2>
            <StaffPlanner />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
