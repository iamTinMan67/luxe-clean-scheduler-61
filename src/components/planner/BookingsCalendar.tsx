
import React, { useEffect, useState } from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingsCalendarContent from './BookingsCalendarContent';

interface BookingsCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  view: PlannerViewType;
  setView: (view: PlannerViewType) => void;
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
  // Force rendering when bookings change
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Function to check if a date has bookings
  const hasBookingsOnDate = (checkDate: Date) => {
    const allBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]')
      .concat(JSON.parse(localStorage.getItem('pendingBookings') || '[]'));
      
    return allBookings.some((booking: any) => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.getDate() === checkDate.getDate() &&
             bookingDate.getMonth() === checkDate.getMonth() &&
             bookingDate.getFullYear() === checkDate.getFullYear();
    });
  };
  
  // Effect to refresh calendar when bookings change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [bookingsForDate]);

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
          <div className="w-full md:w-auto" key={refreshKey}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-black/30 border border-gold/30 rounded-md"
              modifiers={{
                highlighted: hasBookingsOnDate
              }}
              modifiersClassNames={{
                highlighted: "font-bold text-purple-500 dark:text-gold"
              }}
            />
          </div>
          
          <BookingsCalendarContent
            date={date}
            bookingsForDate={bookingsForDate}
            view={view}
            onConfirmBooking={onConfirmBooking}
            onCompleteBooking={onCompleteBooking}
            onDeleteBooking={onDeleteBooking}
            onPackageChange={onPackageChange}
            onReschedule={onReschedule}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsCalendar;
