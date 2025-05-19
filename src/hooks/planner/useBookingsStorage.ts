
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';

export const useBookingsStorage = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load saved bookings from localStorage on component mount
  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  // Load bookings from multiple localStorage sources
  const loadBookingsFromStorage = () => {
    // Load pending bookings
    const savedPendingBookings = localStorage.getItem('pendingBookings');
    if (savedPendingBookings) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedBookings = JSON.parse(savedPendingBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          // Add default time slots based on the booking time
          startTime: booking.startTime || booking.time || "09:00",
          endTime: booking.endTime || 
            (booking.time ? calculateEndTime(booking.time, booking.duration || 120) : "11:00"),
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
          // Add default time slots if missing
          startTime: booking.startTime || booking.time || "09:00",
          endTime: booking.endTime || 
            (booking.time ? calculateEndTime(booking.time, booking.duration || 120) : "11:00"),
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
          // Add default time slots if missing
          startTime: booking.startTime || booking.time || "09:00",
          endTime: booking.endTime || 
            (booking.time ? calculateEndTime(booking.time, booking.duration || 120) : "11:00"),
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
  };
  
  // Helper function to calculate end time based on start time and duration (in minutes)
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };

  // Function to sync bookings with localStorage
  const syncBookings = (pendingBookings: Booking[], confirmedBookings: Booking[]) => {
    // Save pending bookings
    localStorage.setItem('pendingBookings', JSON.stringify(pendingBookings));
    
    // Save confirmed bookings
    localStorage.setItem('confirmedBookings', JSON.stringify(confirmedBookings));
    
    // Also save to planner calendar bookings for compatibility
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(confirmedBookings));
  };
  
  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    syncBookings,
    loadBookingsFromStorage
  };
};
