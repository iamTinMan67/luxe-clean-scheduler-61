
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from '@/types/booking';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingItem from './BookingItem';

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
  return (
    <div className="flex-1">
      <Tabs value={view} defaultValue="daily">
        <TabsContent value="daily" className="mt-0">
          <h3 className="text-xl text-white font-medium mb-4">
            {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          
          {/* Display bookings for the selected date */}
          <div className="space-y-4">
            {bookingsForDate.length > 0 ? (
              bookingsForDate.map((booking) => (
                <BookingItem 
                  key={booking.id}
                  booking={booking}
                  onConfirm={onConfirmBooking}
                  onComplete={onCompleteBooking}
                  onDelete={onDeleteBooking}
                  onPackageChange={onPackageChange}
                  onReschedule={onReschedule}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No bookings scheduled for this date
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-0">
          <h3 className="text-xl text-white font-medium mb-4">Week View</h3>
          <p className="text-white/70">Weekly schedule view coming soon</p>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-0">
          <h3 className="text-xl text-white font-medium mb-4">Month View</h3>
          <p className="text-white/70">Monthly schedule view coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsCalendarContent;
