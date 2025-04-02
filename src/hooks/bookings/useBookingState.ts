
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { toast } from 'sonner';

export const useBookingState = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("daily");

  // Load bookings from localStorage
  useEffect(() => {
    // Load pending bookings
    const savedPendingBookings = localStorage.getItem('pendingBookings');
    if (savedPendingBookings) {
      try {
        const parsedBookings = JSON.parse(savedPendingBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Ensure status is valid
          status: validateBookingStatus(booking.status)
        }));
        setPendingBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing pending bookings:', error);
      }
    }
    
    // Load confirmed bookings
    const savedConfirmedBookings = localStorage.getItem('confirmedBookings');
    if (savedConfirmedBookings) {
      try {
        const parsedBookings = JSON.parse(savedConfirmedBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Ensure status is valid
          status: validateBookingStatus(booking.status)
        }));
        setConfirmedBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
  }, []);

  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    date,
    setDate,
    view,
    setView
  };
};
