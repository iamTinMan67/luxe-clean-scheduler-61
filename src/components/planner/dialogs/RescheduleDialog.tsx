
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from '@/types/booking';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hasTimeConflict } from '@/utils/dateUtils';

interface RescheduleDialogProps {
  booking: Booking;
  onReschedule: (booking: Booking, newDate: Date, newTime?: string) => void;
  trigger?: React.ReactNode;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({ booking, onReschedule, trigger }) => {
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>(
    booking.date instanceof Date ? booking.date : new Date(booking.date)
  );
  const [rescheduledTime, setRescheduledTime] = useState<string>(
    booking.startTime || booking.time || "09:00"
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasConflict, setHasConflict] = useState(false);

  // Time slots for selection
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Reset selected date and time when dialog opens
  useEffect(() => {
    if (isOpen) {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      setRescheduledDate(bookingDate);
      setRescheduledTime(booking.startTime || booking.time || "09:00");
      setRefreshKey(prev => prev + 1);
      checkForConflicts(bookingDate, booking.startTime || booking.time || "09:00");
    }
  }, [isOpen, booking]);

  // Check for conflicts when date or time changes
  useEffect(() => {
    if (rescheduledDate) {
      checkForConflicts(rescheduledDate, rescheduledTime);
    }
  }, [rescheduledDate, rescheduledTime]);

  const checkForConflicts = (date: Date, time: string) => {
    // Get all confirmed bookings from localStorage
    const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    
    // Skip the current booking when checking conflicts
    const filteredBookings = confirmedBookings.filter((b: Booking) => b.id !== booking.id);
    
    // Check if the selected time conflicts with any existing booking
    const conflict = hasTimeConflict(date, time, filteredBookings);
    setHasConflict(conflict);
  };

  const handleReschedule = () => {
    if (rescheduledDate && !hasConflict) {
      onReschedule(booking, rescheduledDate, rescheduledTime);
      toast.success(`Booking rescheduled to ${rescheduledDate.toLocaleDateString()} at ${rescheduledTime}`);
      setIsOpen(false);
    } else if (hasConflict) {
      toast.error("This time slot has a conflict with another booking");
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
        {trigger || (
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9"
          >
            Reschedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Reschedule Booking</DialogTitle>
          <DialogDescription className="text-gray-400">
            Pick a new date and time for {booking.customer}'s appointment
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-center">
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
          
          <div className="space-y-2">
            <label htmlFor="time-select" className="text-sm text-gray-300">Select Time</label>
            <Select
              value={rescheduledTime}
              onValueChange={setRescheduledTime}
            >
              <SelectTrigger id="time-select" className="w-full bg-black/40 border-gray-700">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-700">
                {timeSlots.map((time) => (
                  <SelectItem 
                    key={time} 
                    value={time}
                    className={hasConflict && rescheduledTime === time ? "text-red-500" : ""}
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasConflict && (
              <p className="text-xs text-red-500 mt-1">
                This time slot conflicts with an existing booking
              </p>
            )}
          </div>
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
            disabled={!rescheduledDate || hasConflict}
          >
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
