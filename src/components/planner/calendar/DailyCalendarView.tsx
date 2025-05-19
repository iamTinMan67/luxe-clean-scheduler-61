
import React from 'react';
import { Booking } from '@/types/booking';
import DailyViewHeader from './DailyViewHeader';
import DailyTimeSlot from './DailyTimeSlot';
import EmptyCalendarView from './EmptyCalendarView';

interface DailyCalendarViewProps {
  bookings: Booking[];
  onCompleteBooking?: (booking: Booking) => void;
  onReschedule?: (booking: Booking, newDate: Date) => void;
  onDeleteBooking?: (booking: Booking) => void;
  onUpdateStatus?: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
  onPackageChange?: (booking: Booking, newPackage: string) => void;
}

// Generate time slots for daily view (15-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Only add a new entry if we're not past the end time
      if (!(hour === endHour && minute > 0)) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
  }
  
  return slots;
};

const DailyCalendarView: React.FC<DailyCalendarViewProps> = ({ 
  bookings,
  onCompleteBooking,
  onReschedule,
  onDeleteBooking,
  onUpdateStatus,
  onPackageChange
}) => {
  const timeSlots = generateTimeSlots();
  
  if (bookings.length === 0) {
    return <EmptyCalendarView message="No bookings scheduled for this day" />;
  }
  
  return (
    <div className="flex-1 overflow-auto max-h-[500px]">
      <div className="flex flex-col gap-2">
        <DailyViewHeader timeSlots={timeSlots} />
        
        <div className="flex flex-col gap-2">
          {bookings.map(booking => (
            <DailyTimeSlot 
              key={booking.id} 
              booking={booking}
              onCompleteBooking={onCompleteBooking}
              onReschedule={onReschedule}
              onDeleteBooking={onDeleteBooking}
              onUpdateStatus={onUpdateStatus}
              onPackageChange={onPackageChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyCalendarView;
