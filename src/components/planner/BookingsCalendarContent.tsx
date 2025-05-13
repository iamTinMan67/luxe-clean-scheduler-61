
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Booking } from '@/types/booking';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingItem from './BookingItem';
import { format, isSameDay } from 'date-fns';
import { Clock } from 'lucide-react';

interface BookingsCalendarContentProps {
  date: Date | undefined;
  bookingsForDate: Booking[];
  view: PlannerViewType;
  onConfirmBooking: (booking: Booking) => void;
  onCompleteBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const BookingsCalendarContent: React.FC<BookingsCalendarContentProps> = ({
  date,
  bookingsForDate,
  view,
  onConfirmBooking,
  onCompleteBooking,
  onDeleteBooking,
  onPackageChange,
  onReschedule
}) => {
  // Group bookings by time for daily view
  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Get bookings for a specific time slot
  const getBookingsForTimeSlot = (time: string) => {
    if (!date) return [];

    return bookingsForDate.filter(booking => {
      const bookingTime = booking.startTime || booking.time || '09:00';
      // Check if the booking starts at this time slot
      return bookingTime === time;
    });
  };

  const renderDailyView = () => {
    if (!date) return null;

    return (
      <>
        <h3 className="text-xl text-white font-medium mb-4">
          {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        
        {/* Time slots with bookings */}
        <div className="space-y-2">
          {timeSlots.map((time) => {
            const slotBookings = getBookingsForTimeSlot(time);
            if (slotBookings.length === 0) return null;
            
            return (
              <div key={time} className="border-l-2 border-gold pl-4 py-2">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2 text-gold" />
                  <span className="text-white font-medium">{time}</span>
                </div>
                <div className="space-y-4">
                  {slotBookings.map((booking) => (
                    <BookingItem 
                      key={booking.id}
                      booking={booking}
                      onConfirm={onConfirmBooking}
                      onComplete={onCompleteBooking}
                      onDelete={onDeleteBooking}
                      onPackageChange={onPackageChange}
                      onReschedule={onReschedule}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* If no bookings in any time slot */}
          {bookingsForDate.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No bookings scheduled for this date
            </div>
          )}
        </div>
      </>
    );
  };

  const renderWeeklyView = () => {
    return (
      <>
        <h3 className="text-xl text-white font-medium mb-4">Week View</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Would render a weekly calendar view here similar to WeeklyPlanner */}
          <p className="text-white/70 col-span-full">Weekly schedule view coming soon</p>
        </div>
      </>
    );
  };

  const renderMonthlyView = () => {
    return (
      <>
        <h3 className="text-xl text-white font-medium mb-4">Month View</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {/* Would render a monthly calendar view here similar to MonthlyPlanner */}
          <p className="text-white/70 col-span-full">Monthly schedule view coming soon</p>
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 overflow-auto max-h-[70vh]">
      <Tabs value={view} defaultValue="daily">
        <TabsContent value="daily" className="mt-0">
          {renderDailyView()}
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-0">
          {renderWeeklyView()}
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-0">
          {renderMonthlyView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsCalendarContent;
