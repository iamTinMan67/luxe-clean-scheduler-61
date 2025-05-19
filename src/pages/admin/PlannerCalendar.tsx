
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlannerCalendar } from "@/hooks/usePlannerCalendar";
import PendingBookingsList from "@/components/planner/PendingBookingsList";
import ScheduleCalendar from "@/components/planner/ScheduleCalendar";
import { Card, CardContent } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import BookingsCalendar from "@/components/planner/BookingsCalendar";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-black pb-16" key={key}>
      <section className="relative py-6">
        <div className="container mx-auto px-4">
          {/* Centered Main heading with date display */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Planner Dashboard: {format(date, "MMMM d, yyyy")}
            </h1>
            <p className="text-gray-400">Manage bookings and staff schedules</p>
          </div>
          
          {/* Pending Bookings List - Moved above date controllers */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PendingBookingsList 
              pendingBookings={pendingBookings}
              handleConfirmBooking={handleConfirmBooking}
              handleCancelBooking={handleCancelBooking}
              getBookingBackground={getBookingBackground}
            />
          </motion.div>
          
          {/* Navigation Controls */}
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
          
          {/* Calendar Grid Layout */}
          <div className="grid grid-cols-1 gap-6">
            {/* Calendar View */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <h2 className="text-xl font-bold text-white mb-4">Calendar</h2>
                <ScheduleCalendar
                  date={date}
                  setDate={setDate}
                  schedule={schedule}
                  getBookingBackground={getBookingBackground}
                  hasBookingsOnDate={hasBookingsOnDate}
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
