
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';

export const useBookingsStorage = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load saved bookings from localStorage on component mount
  useEffect(() => {
    // Load pending bookings
    const savedPendingBookings = localStorage.getItem('pendingBookings');
    if (savedPendingBookings) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedBookings = JSON.parse(savedPendingBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Add default time slots based on the booking time
          startTime: booking.time || "09:00",
          endTime: booking.time ? 
            `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` : 
            "11:00",
          status: validateBookingStatus(booking.status)
        }));
        setPendingBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing bookings:', error);
      }
    }

    // Look for both standard confirmed bookings and planner calendar bookings
    let allConfirmedBookings: Booking[] = [];
    
    const savedConfirmedBookings = localStorage.getItem('confirmedBookings');
    if (savedConfirmedBookings) {
      try {
        const parsedBookings = JSON.parse(savedConfirmedBookings).map((booking: any) => ({
          ...booking,
          // Ensure date is a Date object
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        allConfirmedBookings = [...allConfirmedBookings, ...parsedBookings];
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
    
    // Also check for bookings added directly to planner calendar
    const plannerCalendarBookings = localStorage.getItem('plannerCalendarBookings');
    if (plannerCalendarBookings) {
      try {
        const parsedBookings = JSON.parse(plannerCalendarBookings).map((booking: any) => ({
          ...booking,
          // Ensure date is a Date object
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        
        // Merge bookings, avoiding duplicates by ID
        const existingIds = new Set(allConfirmedBookings.map(b => b.id));
        const uniquePlannerBookings = parsedBookings.filter((b: Booking) => !existingIds.has(b.id));
        
        allConfirmedBookings = [...allConfirmedBookings, ...uniquePlannerBookings];
      } catch (error) {
        console.error('Error parsing planner calendar bookings:', error);
      }
    }
    
    setConfirmedBookings(allConfirmedBookings);
  }, []);
  
  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings
  };
};
