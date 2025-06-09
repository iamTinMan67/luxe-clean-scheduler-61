
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';

export const useScheduledAppointments = (statusFilter?: string[]) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = () => {
      try {
        // Get confirmed bookings from planner storage
        const confirmedBookings = localStorage.getItem('confirmedBookings');
        const pendingBookings = localStorage.getItem('pendingBookings');
        
        let allBookings: Booking[] = [];
        
        // Parse confirmed bookings
        if (confirmedBookings) {
          const confirmed = JSON.parse(confirmedBookings);
          allBookings = [...allBookings, ...confirmed];
        }
        
        // Parse pending bookings
        if (pendingBookings) {
          const pending = JSON.parse(pendingBookings);
          allBookings = [...allBookings, ...pending];
        }
        
        // Convert date strings to Date objects
        const processedBookings = allBookings.map(booking => ({
          ...booking,
          date: booking.date instanceof Date ? booking.date : new Date(booking.date)
        }));
        
        // Apply status filter if provided
        const filteredBookings = statusFilter && statusFilter.length > 0 
          ? processedBookings.filter(booking => statusFilter.includes(booking.status))
          : processedBookings;
        
        setAppointments(filteredBookings);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'confirmedBookings' || e.key === 'pendingBookings') {
        loadAppointments();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when bookings are updated within the same tab
    const handleBookingUpdate = () => {
      loadAppointments();
    };
    
    window.addEventListener('bookingsUpdated', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookingsUpdated', handleBookingUpdate);
    };
  }, [statusFilter]);

  return { appointments, loading };
};
