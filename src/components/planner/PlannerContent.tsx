
import React from "react";
import { motion } from "framer-motion";
import PendingBookingsList from './PendingBookingsList';
import WeeklyPlanner from './WeeklyPlanner';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { Booking } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PlannerContentProps {
  date: Date;
  setDate: (date: Date) => void;
  view: PlannerViewType;
  pendingBookings: Booking[];
  confirmedBookings: Booking[];
  schedule: Array<{date: Date, bookings: Booking[]}>;
  handleConfirmBooking: (bookingId: string, selectedStaff: string[], travelMinutes: number) => void;
  handleCancelBooking: (bookingId: string) => void;
  getBookingBackground: (booking: Booking) => string;
  hasBookingsOnDate: (date: Date) => boolean;
  checkTimeConflict: (date: Date, time: string) => boolean;
  // New props for navigation functions
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  setView: (view: PlannerViewType) => void;
}

const PlannerContent: React.FC<PlannerContentProps> = ({
  date,
  setDate,
  view,
  pendingBookings,
  confirmedBookings,
  schedule,
  handleConfirmBooking,
  handleCancelBooking,
  getBookingBackground,
  hasBookingsOnDate,
  checkTimeConflict,
  navigatePrevious,
  navigateNext,
  navigateToday,
  setView
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
      
      {/* Navigation controls moved below pending bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 mt-4 flex justify-center"
      >
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center rounded-md border border-gray-800 mr-2">
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
      
      {/* View Specific Planners */}
      {view === "weekly" && (
        <WeeklyPlanner
          date={date}
          setDate={setDate}
          schedule={schedule}
          getBookingBackground={getBookingBackground}
          checkTimeConflict={checkTimeConflict}
        />
      )}
    </div>
  );
};

export default PlannerContent;
