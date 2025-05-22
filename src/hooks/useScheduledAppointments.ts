
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';

export const useScheduledAppointments = () => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = () => {
      setLoading(true);
      try {
        // Load appointments from localStorage
        const confirmedBookingsData = localStorage.getItem('confirmedBookings');
        const plannerBookingsData = localStorage.getItem('plannerCalendarBookings');
        
        let allAppointments: Booking[] = [];
        
        // Parse confirmed bookings
        if (confirmedBookingsData) {
          const confirmedBookings = JSON.parse(confirmedBookingsData);
          allAppointments = [...allAppointments, ...confirmedBookings];
        }
        
        // Parse planner bookings
        if (plannerBookingsData) {
          const plannerBookings = JSON.parse(plannerBookingsData);
          // Filter out duplicates by ID
          const existingIds = new Set(allAppointments.map(b => b.id));
          const uniquePlannerBookings = plannerBookings.filter((b: Booking) => !existingIds.has(b.id));
          allAppointments = [...allAppointments, ...uniquePlannerBookings];
        }
        
        // Filter to only include appointments with status "confirmed" for initial selection
        // in the pre-inspection page
        const confirmedAppointments = allAppointments.filter(
          booking => booking.status === "confirmed"
        );
        
        setAppointments(confirmedAppointments);
      } catch (error) {
        console.error('Error loading scheduled appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);
  
  return { appointments, loading };
};
