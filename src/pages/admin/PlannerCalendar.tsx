
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import CalendarHeader from "@/components/planner/CalendarHeader";
import PendingBookingsList from "@/components/planner/PendingBookingsList";
import ScheduleCalendar from "@/components/planner/ScheduleCalendar";
import { Card, CardContent } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import BookingsCalendar from "@/components/planner/BookingsCalendar";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffTimeline from "@/components/planner/calendar/StaffTimeline";
import { format } from "date-fns";

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
      <section className="relative py-6">
        <div className="container mx-auto px-4">
          {/* Main heading with date display */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Planner Dashboard: {format(date, "MMMM d, yyyy")}
            </h1>
            <p className="text-gray-400">Manage bookings and staff schedules</p>
          </div>
          
          {/* Navigation Controls - Moved to the top level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <Card className="bg-gray-900 border-gray-800 p-4 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                
                <div className="flex">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-r-none border-gray-800 text-white hover:text-gold"
                    onClick={navigatePrevious}
                  >
                    {view === 'daily' ? <ChevronLeft className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-none border-l-0 border-r-0 border-gray-800 text-white"
                    onClick={navigateToday}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-l-none border-gray-800 text-white hover:text-gold"
                    onClick={navigateNext}
                  >
                    {view === 'daily' ? <ChevronRight className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Three-panel grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Pending Bookings - Spans full width on top */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Pending Bookings List */}
              <PendingBookingsList 
                pendingBookings={pendingBookings}
                handleConfirmBooking={handleConfirmBooking}
                handleCancelBooking={handleCancelBooking}
                getBookingBackground={getBookingBackground}
              />
            </motion.div>
            
            {/* Panel 2: Calendar View - Left side of bottom row */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <h2 className="text-xl font-bold text-white mb-4">Date Selection</h2>
                <ScheduleCalendar
                  date={date}
                  setDate={setDate}
                  schedule={schedule}
                  getBookingBackground={getBookingBackground}
                  hasBookingsOnDate={hasBookingsOnDate}
                />
              </Card>
            </motion.div>
            
            {/* Panel 3: Staff Timeline - Right side of bottom row */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <h2 className="text-xl font-bold text-white mb-4">Staff Schedule</h2>
                <StaffTimeline 
                  date={staffDate || new Date()}
                  bookings={getBookingsForDate()}
                  onCompleteBooking={handleCompleteBooking}
                  onReschedule={handleReschedule}
                  onDeleteBooking={handleDeleteBooking}
                  onUpdateStatus={handleUpdateStatus}
                  onPackageChange={handlePackageChange}
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlannerCalendar;
