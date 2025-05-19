
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
          startTime: booking.time || booking.startTime || "09:00",
          endTime: booking.endTime || (booking.time ? 
            // If we have time but no endTime, calculate 2 hours later
            calculateEndTime(booking.time) : 
            // If we have startTime but no endTime, calculate 2 hours later
            (booking.startTime ? calculateEndTime(booking.startTime) : "11:00")),
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
          // Ensure time slots are properly set
          startTime: booking.time || booking.startTime || "09:00",
          endTime: booking.endTime || (booking.time ? 
            // If we have time but no endTime, calculate 2 hours later
            calculateEndTime(booking.time) : 
            // If we have startTime but no endTime, calculate 2 hours later
            (booking.startTime ? calculateEndTime(booking.startTime) : "11:00")),
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
          // Ensure time slots are properly set
          startTime: booking.time || booking.startTime || "09:00",
          endTime: booking.endTime || (booking.time ? 
            // If we have time but no endTime, calculate 2 hours later
            calculateEndTime(booking.time) : 
            // If we have startTime but no endTime, calculate 2 hours later
            (booking.startTime ? calculateEndTime(booking.startTime) : "11:00")),
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
  
  // Helper function to calculate an end time based on a start time
  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + 2; // Default duration of 2 hours
    
    // Handle overflow to next day
    if (endHours >= 24) {
      endHours = endHours - 24;
    }
    
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings
  };
};

