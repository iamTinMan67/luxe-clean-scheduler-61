
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from '@/types/booking';
import ScheduleDay from './ScheduleDay';

interface ScheduleCalendarProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  schedule: Array<{date: Date, bookings: Booking[]}>;
  getBookingBackground: (booking: Booking) => string;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  date,
  setDate,
  schedule,
  getBookingBackground
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar for date selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="bg-gray-900 border border-gray-800 rounded-md p-4"
            classNames={{
              day_selected: "bg-gold text-black",
              day_today: "bg-gray-800 text-white",
              day: "text-white hover:bg-gray-800"
            }}
          />
        </Card>
      </motion.div>
      
      {/* Schedule view */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:col-span-2"
      >
        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Schedule</h2>
          </div>
          
          {/* Schedule grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {schedule.map((daySchedule) => (
              <ScheduleDay 
                key={daySchedule.date.toISOString()} 
                date={daySchedule.date} 
                bookings={daySchedule.bookings} 
                getBookingBackground={getBookingBackground}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScheduleCalendar;
