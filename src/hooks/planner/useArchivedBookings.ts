
import { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { subDays, isAfter } from 'date-fns';

export const useArchivedBookings = () => {
  const [archivedBookings, setArchivedBookings] = useState<Booking[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);

  const loadBookings = () => {
    // Get all bookings from localStorage
    const confirmedBookingsData = localStorage.getItem('confirmedBookings');
    const plannerBookingsData = localStorage.getItem('plannerCalendarBookings');
    const archivedBookingsData = localStorage.getItem('archivedBookings');
    
    let allBookings: Booking[] = [];
    let alreadyArchivedBookings: Booking[] = [];
    
    // Load already archived bookings first
    if (archivedBookingsData) {
      try {
        alreadyArchivedBookings = JSON.parse(archivedBookingsData);
      } catch (error) {
        console.error('Error parsing archived bookings:', error);
        alreadyArchivedBookings = [];
      }
    }
    
    if (confirmedBookingsData) {
      try {
        const parsedBookings = JSON.parse(confirmedBookingsData);
        allBookings = [...allBookings, ...parsedBookings];
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
    
    if (plannerBookingsData) {
      try {
        const parsedBookings = JSON.parse(plannerBookingsData);
        // Filter out duplicates
        const existingIds = new Set(allBookings.map(b => b.id));
        const uniqueBookings = parsedBookings.filter((b: Booking) => !existingIds.has(b.id));
        allBookings = [...allBookings, ...uniqueBookings];
      } catch (error) {
        console.error('Error parsing planner bookings:', error);
      }
    }
    
    // Get the date for 7 days ago
    const archiveThreshold = subDays(new Date(), 7);
    
    // Separate bookings into active and archived
    const archived: Booking[] = [];
    const active: Booking[] = [];
    
    allBookings.forEach(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      
      // Bookings that are finished should be archived
      if (booking.status === 'finished') {
        archived.push(booking);
      } else {
        active.push(booking);
      }
    });
    
    // Combine with previously archived bookings
    const combinedArchived = [...archived, ...alreadyArchivedBookings];
    
    // Remove duplicates from combined archived bookings
    const uniqueArchived = combinedArchived.filter((booking, index, self) => 
      index === self.findIndex(b => b.id === booking.id)
    );
    
    setArchivedBookings(uniqueArchived);
    setActiveBookings(active);
    
    // Update localStorage with only active bookings
    localStorage.setItem('confirmedBookings', JSON.stringify(active));
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(active));
    
    // Store archived bookings separately
    localStorage.setItem('archivedBookings', JSON.stringify(uniqueArchived));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Load archived bookings from storage
  const loadArchivedFromStorage = (): Booking[] => {
    try {
      const archivedData = localStorage.getItem('archivedBookings');
      return archivedData ? JSON.parse(archivedData) : [];
    } catch (error) {
      console.error('Error loading archived bookings:', error);
      return [];
    }
  };

  // Archive a specific booking
  const archiveBooking = (booking: Booking) => {
    // Update active bookings
    const updatedActive = activeBookings.filter(b => b.id !== booking.id);
    setActiveBookings(updatedActive);
    
    // Add to archived
    const updatedArchived = [...archivedBookings, booking];
    setArchivedBookings(updatedArchived);
    
    // Update localStorage
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedActive));
    localStorage.setItem('plannerCalendarBookings', JSON.stringify(updatedActive));
    localStorage.setItem('archivedBookings', JSON.stringify(updatedArchived));
  };

  // Get total counts for dashboard
  const getTotalCounts = () => {
    const totalBookings = archivedBookings.length + activeBookings.length;
    
    // Count unique customers
    const allCustomerNames = new Set([
      ...archivedBookings.map(b => b.customer), 
      ...activeBookings.map(b => b.customer)
    ]);
    
    // Count vehicles
    const vehicleCount = archivedBookings.length + activeBookings.length;
    
    // Calculate total revenue
    const totalRevenue = [
      ...archivedBookings, 
      ...activeBookings
    ].reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    return {
      totalBookings,
      totalCustomers: allCustomerNames.size,
      totalVehicles: vehicleCount,
      totalRevenue
    };
  };

  return {
    archivedBookings,
    activeBookings,
    loadBookings,
    archiveBooking,
    getTotalCounts
  };
};
