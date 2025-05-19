
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock } from "lucide-react";
import { Booking } from '@/types/booking';

interface RescheduleDialogProps {
  booking: Booking;
  onReschedule: (booking: Booking, newDate: Date) => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({ booking, onReschedule }) => {
  const [rescheduledDate, setRescheduledDate] = useState<Date | undefined>(
    booking.date instanceof Date ? booking.date : new Date(booking.date)
  );

  return (
    <Dialog>
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
            mode="single"
            selected={rescheduledDate}
            onSelect={setRescheduledDate}
            initialFocus
            className="border border-gray-800 rounded-md"
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-gray-800 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            className="bg-gold hover:bg-gold/80 text-black"
            onClick={() => rescheduledDate && onReschedule(booking, rescheduledDate)}
          >
            Confirm Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
