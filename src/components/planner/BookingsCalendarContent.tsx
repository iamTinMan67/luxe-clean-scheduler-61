
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
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
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
  const confirmedBookingsForDate = bookingsForDate.filter(booking => booking.status === 'confirmed' || 
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
  
  // If daily view, show time slots
  if (view === 'daily') {
    const timeSlots = generateTimeSlots();
    // Map bookings to their time slots
    const bookingsByTime: Record<string, Booking[]> = {};
    
    confirmedBookingsForDate.forEach(booking => {
      const timeSlot = booking.startTime || booking.time || '09:00';
      if (!bookingsByTime[timeSlot]) {
        bookingsByTime[timeSlot] = [];
      }
      bookingsByTime[timeSlot].push(booking);
    });
    
    return (
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-none">
        <div className="relative">
          {timeSlots.map((timeSlot, index) => {
            const hasBooking = bookingsByTime[timeSlot] && bookingsByTime[timeSlot].length > 0;
            const isHourStart = timeSlot.endsWith(':00');
            
            return (
              <div key={timeSlot} className={`flex items-start ${isHourStart ? 'mt-4' : 'mt-1'}`}>
                <div className={`min-w-[60px] text-right pr-2 ${isHourStart ? 'font-bold text-white' : 'text-xs text-gray-400'}`}>
                  {timeSlot}
                </div>
                
                <div className="flex-1 border-l border-gray-700 pl-2 min-h-[20px]">
                  {hasBooking ? (
                    <div className="space-y-1 mb-1">
                      {bookingsByTime[timeSlot].map(booking => (
                        <Card key={booking.id} className="bg-green-900/40 border-green-700/50 p-2">
                          <CardContent className="p-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-white">{booking.customer}</div>
                                <div className="text-xs text-gray-300">{booking.packageType}</div>
                                {booking.vehicleReg && (
                                  <Badge variant="outline" className="mt-1 text-xs">
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
                            
                            <div className="mt-2 text-xs text-gray-300 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.startTime || booking.time} - {booking.endTime || 'N/A'}
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {booking.staff && booking.staff.map(staff => (
                                <Badge key={staff} variant="outline" className="bg-blue-900/30 text-blue-300 text-xs">
                                  {staff}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
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
