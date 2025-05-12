
import React from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import BookingItem from './BookingItem';
import { PlannerViewType } from '@/hooks/usePlannerCalendar';

interface BookingsCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  view: PlannerViewType;  // Updated to use PlannerViewType
  setView: (view: PlannerViewType) => void;  // Updated to use PlannerViewType
  bookingsForDate: Booking[];
  onConfirmBooking: (booking: Booking) => void;
  onCompleteBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
  onPackageChange: (booking: Booking, newPackage: string) => void;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const BookingsCalendar: React.FC<BookingsCalendarProps> = ({
  date,
  setDate,
  view,
  setView,
  bookingsForDate,
  onConfirmBooking,
  onCompleteBooking,
  onDeleteBooking,
  onPackageChange,
  onReschedule
}) => {
  return (
    <Card className="lg:col-span-2 bg-black/60 border-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Schedule View</CardTitle>
            <CardDescription className="text-gold/70">
              Plan and organize team assignments
            </CardDescription>
          </div>
          <Tabs defaultValue="daily" value={view} onValueChange={setView}>
            <TabsList className="bg-black/60">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-black/30 border border-gold/30 rounded-md"
            />
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsCalendar;
