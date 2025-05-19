
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock } from "lucide-react";
import { Booking } from '@/types/booking';
import { toast } from "sonner";

interface RescheduleDialogProps {
  booking: Booking;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({ booking, onReschedule }) => {
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>(
    booking.date instanceof Date ? booking.date : new Date(booking.date)
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Reset selected date when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRescheduledDate(booking.date instanceof Date ? booking.date : new Date(booking.date));
      setRefreshKey(prev => prev + 1);
    }
  }, [isOpen, booking.date]);

  const handleReschedule = () => {
    if (rescheduledDate) {
      onReschedule(booking, rescheduledDate);
      toast.success(`Booking rescheduled to ${rescheduledDate.toLocaleDateString()}`);
      setIsOpen(false);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2 text-xs"
        >
          <CalendarClock className="h-3 w-3 mr-1" /> Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Reschedule Booking</DialogTitle>
          <DialogDescription className="text-gray-400">
            Pick a new date for {booking.customer}'s appointment
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex justify-center">
          <Calendar
            key={refreshKey}
            mode="single"
            selected={rescheduledDate}
            onSelect={setRescheduledDate}
            initialFocus
            className="border border-gray-800 rounded-md"
            modifiers={{
              highlighted: hasBookingsOnDate
            }}
            modifiersClassNames={{
              highlighted: "font-bold text-purple-500 dark:text-gold"
            }}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-gray-800 hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-gold hover:bg-gold/80 text-black"
            onClick={handleReschedule}
            disabled={!rescheduledDate}
          >
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
