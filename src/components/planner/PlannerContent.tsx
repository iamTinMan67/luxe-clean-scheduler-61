
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import MonthlyCalendar from './MonthlyCalendar';
import DailySchedule from './DailySchedule';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { Booking } from '@/types/booking';

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
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
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
  navigateToday
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Monthly calendar view */}
        <MonthlyCalendar 
          date={date}
          setDate={setDate}
          bookings={[...confirmedBookings, ...pendingBookings]}
          hasBookingsOnDate={hasBookingsOnDate}
          navigatePrevious={navigatePrevious}
          navigateNext={navigateNext}
        />
      </CardContent>
    </Card>
  );
};

export default PlannerContent;
