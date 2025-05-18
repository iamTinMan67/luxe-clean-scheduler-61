
import React, { useEffect, useState } from 'react';
import { Booking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { PlannerViewType } from '@/hooks/usePlannerCalendar';
import BookingsCalendarContent from './BookingsCalendarContent';
import { format } from 'date-fns';
import CalendarViewSelector from './calendar/CalendarViewSelector';
import CalendarDatePicker from './calendar/CalendarDatePicker';

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
  onUpdateStatus: (booking: Booking, newStatus: "confirmed" | "in-progress" | "completed" | "finished") => void;
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
  onReschedule,
  onUpdateStatus
}) => {
  // Force rendering when bookings change
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Effect to refresh calendar when bookings change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [bookingsForDate]);

  return (
    <Card className="lg:col-span-2 bg-black/60 border-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">
              {view === 'daily' ? 
                `Daily Schedule: ${date ? format(date, 'EEEE, MMMM d, yyyy') : 'Select a date'}` :
                'Schedule View'}
            </CardTitle>
            <CardDescription className="text-gold/70">
              {view === 'daily' ? '15-minute time slots' : 'Plan and organize team assignments'}
            </CardDescription>
          </div>
          <CalendarViewSelector 
            view={view} 
            onViewChange={(v) => setView(v as PlannerViewType)} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {view !== 'daily' && (
            <CalendarDatePicker 
              date={date}
              onDateChange={setDate}
              refreshKey={refreshKey}
            />
          )}
          
          <BookingsCalendarContent
            date={date}
            bookingsForDate={bookingsForDate}
            view={view}
            onConfirmBooking={onConfirmBooking}
            onCompleteBooking={onCompleteBooking}
            onDeleteBooking={onDeleteBooking}
            onPackageChange={onPackageChange}
            onReschedule={onReschedule}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsCalendar;
