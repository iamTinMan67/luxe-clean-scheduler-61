
import React from 'react';
import { Booking } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface BookingsCalendarContentProps {
  date: Date | undefined;
  bookingsForDate: Booking[];
  view: PlannerViewType;
  onConfirmBooking: (booking: Booking) => void;
  onCompleteBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
}

// Generate time slots for daily view (15-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  return slots;
};

const BookingsCalendarContent: React.FC<BookingsCalendarContentProps> = ({
  date,
  bookingsForDate,
  view,
  onConfirmBooking,
  onCompleteBooking,
  onDeleteBooking,
  onPackageChange,
  onReschedule,
  onUpdateStatus
}) => {
  // Only show confirmed bookings
  const confirmedBookingsForDate = bookingsForDate.filter(booking => 
    booking.status === 'confirmed' || 
    booking.status === 'in-progress' || 
    booking.status === 'completed');
  
  if (!date) {
    return (
      <div className="flex-1 text-center py-8 text-gray-500">
        <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        Please select a date to view bookings
      </div>
    );
  }
  
  // If daily view, show time slots horizontally
  if (view === 'daily') {
    const timeSlots = generateTimeSlots();
    // Map bookings to their time slots
    const bookingsByTime: Record<string, Booking[]> = {};
    
    confirmedBookingsForDate.forEach(booking => {
      const timeSlot = booking.startTime || booking.time || '08:00';
      if (!bookingsByTime[timeSlot]) {
        bookingsByTime[timeSlot] = [];
      }
      bookingsByTime[timeSlot].push(booking);
    });
    
    return (
      <div className="flex-1 overflow-auto max-h-[500px]">
        <div className="flex flex-col gap-2">
          {/* Time header */}
          <div className="flex sticky top-0 bg-black/80 z-10 border-b border-gray-700 py-2">
            <div className="min-w-[80px] font-bold text-white">Time</div>
            <div className="flex-1 overflow-x-auto">
              <div className="flex min-w-max">
                {Array.from(new Set(timeSlots.map(slot => slot.split(':')[0]))).map(hour => (
                  <div key={hour} className="w-[120px] text-center font-bold text-gold">
                    {hour}:00
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bookings by hour rows */}
          <div className="flex flex-col gap-2">
            {confirmedBookingsForDate.map(booking => {
              const startTime = booking.startTime || booking.time || '08:00';
              const [startHour, startMinute] = startTime.split(':').map(Number);
              const totalStartMinutes = startHour * 60 + startMinute;
              
              // Calculate position based on start time (8:00 = 0 minutes from start)
              const startPosition = totalStartMinutes - 8 * 60;
              // Calculate width based on duration (default 60 minutes if not specified)
              const duration = 60; // Default to 60 minutes
              
              return (
                <div key={booking.id} className="flex items-center">
                  <div className="min-w-[80px] text-gray-300 text-sm font-medium">
                    {startTime}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <div className="relative min-w-max h-16" style={{paddingLeft: `${(startPosition / 15) * 30}px`}}>
                      <Card 
                        className={`absolute top-0 bg-green-900/40 border-green-700/50`}
                        style={{width: `${duration * 2}px`, minWidth: '120px'}}
                      >
                        <CardContent className="p-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-white truncate">{booking.customer}</div>
                              <div className="text-xs text-gray-300 truncate">{booking.packageType}</div>
                            </div>
                            <Badge className={`${
                              booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
                              booking.status === "in-progress" ? "bg-blue-900/60 text-blue-300" :
                              "bg-purple-900/60 text-purple-300"
                            }`}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {confirmedBookingsForDate.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No bookings scheduled for this day
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // For weekly and monthly views
  return (
    <div className="flex-1 overflow-y-auto max-h-[500px]">
      {confirmedBookingsForDate.length > 0 ? (
        confirmedBookingsForDate.map(booking => (
          <div key={booking.id} className="mb-4 p-3 bg-green-900/30 border border-green-600/50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{booking.customer}</h3>
                <p className="text-sm text-gray-300">{booking.packageType}</p>
                <div className="text-xs text-gray-400 mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {booking.startTime || booking.time} - {booking.endTime || 'N/A'}
                </div>
                {booking.vehicleReg && (
                  <Badge variant="outline" className="mt-2">
                    {booking.vehicleReg}
                  </Badge>
                )}
              </div>
              <Badge className={`${
                booking.status === "confirmed" ? "bg-green-900/60 text-green-300" : 
                booking.status === "in-progress" ? "bg-blue-900/60 text-blue-300" :
                "bg-purple-900/60 text-purple-300"
              }`}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-green-900/30 border-green-600/50 text-green-300 hover:bg-green-800/50"
                onClick={() => onCompleteBooking(booking)}
              >
                Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-blue-900/30 border-blue-600/50 text-blue-300 hover:bg-blue-800/50"
                onClick={() => onReschedule(booking, date)}
              >
                Reschedule
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-red-900/30 border-red-600/50 text-red-300 hover:bg-red-800/50"
                onClick={() => onDeleteBooking(booking)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          No bookings scheduled for the selected {view === 'weekly' ? 'week' : 'month'}
        </div>
      )}
    </div>
  );
};

export default BookingsCalendarContent;
