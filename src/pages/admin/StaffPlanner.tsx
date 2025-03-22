
import React from "react";
import { motion } from "framer-motion";
import StaffList from "@/components/planner/StaffList";
import BookingsCalendar from "@/components/planner/BookingsCalendar";
import { useBookings } from "@/hooks/useBookings";

const StaffPlanner = () => {
  const {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view,
    setView,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking
  } = useBookings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Staff Planner</h1>
        <p className="text-gold">Manage your team's schedule and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StaffList />
        <BookingsCalendar 
          date={date}
          setDate={setDate}
          view={view}
          setView={setView}
          bookingsForDate={getBookingsForDate()}
          onConfirmBooking={handleConfirmBooking}
          onCompleteBooking={handleCompleteBooking}
          onDeleteBooking={handleDeleteBooking}
          onPackageChange={handlePackageChange}
          onReschedule={handleReschedule}
        />
      </div>
    </motion.div>
  );
};

export default StaffPlanner;
