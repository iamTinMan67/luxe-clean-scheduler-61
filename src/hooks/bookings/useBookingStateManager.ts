
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';

export const useBookingStateManager = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Load bookings from localStorage
  useEffect(() => {
    loadBookingsFromStorage();
  }, []);

  const loadBookingsFromStorage = () => {
    // Load pending bookings
    const savedPendingBookings = localStorage.getItem('pendingBookings');
    if (savedPendingBookings) {
      try {
        const parsedBookings = JSON.parse(savedPendingBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        setPendingBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing pending bookings:', error);
        setPendingBookings(getDemoPendingBookings());
      }
    } else {
      setPendingBookings(getDemoPendingBookings());
    }
    
    // Load confirmed bookings from multiple sources
    let allConfirmedBookings: Booking[] = [];
    
    // From confirmedBookings in localStorage
    const savedConfirmedBookings = localStorage.getItem('confirmedBookings');
    if (savedConfirmedBookings) {
      try {
        const parsedBookings = JSON.parse(savedConfirmedBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        allConfirmedBookings = [...allConfirmedBookings, ...parsedBookings];
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
    
    // From plannerCalendarBookings in localStorage
    const plannerCalendarBookings = localStorage.getItem('plannerCalendarBookings');
    if (plannerCalendarBookings) {
      try {
        const parsedBookings = JSON.parse(plannerCalendarBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        
        // De-duplicate by ID
        const existingIds = new Set(allConfirmedBookings.map(b => b.id));
        const uniquePlannerBookings = parsedBookings.filter((b: Booking) => !existingIds.has(b.id));
        
        allConfirmedBookings = [...allConfirmedBookings, ...uniquePlannerBookings];
      } catch (error) {
        console.error('Error parsing planner calendar bookings:', error);
      }
    }
    
    if (allConfirmedBookings.length === 0) {
      allConfirmedBookings = getDemoConfirmedBookings();
    }
    
    setConfirmedBookings(allConfirmedBookings);
  };

  // Save bookings to localStorage
  const saveBookingsToStorage = (type: 'pending' | 'confirmed', bookings: Booking[]) => {
    localStorage.setItem(`${type}Bookings`, JSON.stringify(bookings));
    
    // Also update planner calendar data for confirmed bookings
    if (type === 'confirmed') {
      localStorage.setItem('plannerCalendarBookings', JSON.stringify(bookings));
    }
  };

  // Generate demo pending bookings
  const getDemoPendingBookings = (): Booking[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: "PB-001",
        customer: "John Doe",
        vehicle: "BMW 3 Series",
        packageType: "elite",
        date: today,
        time: "10:00",
        location: "Customer's Location",
        status: "pending",
        totalPrice: 199,
        notes: "Customer prefers payment by cash",
        condition: 7
      },
      {
        id: "PB-002",
        customer: "Jane Smith",
        vehicle: "Mercedes Sprinter",
        packageType: "medium",
        date: tomorrow,
        time: "14:00",
        location: "Main Office",
        status: "pending",
        totalPrice: 129,
        notes: "",
        condition: 5
      }
    ];
  };

  // Generate demo confirmed bookings
  const getDemoConfirmedBookings = (): Booking[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: "CB-001",
        customer: "Alice Johnson",
        vehicle: "Audi A4",
        packageType: "main",
        date: today,
        time: "09:00",
        startTime: "09:00",
        endTime: "11:00",
        location: "Detailing Center",
        status: "confirmed",
        totalPrice: 79,
        notes: "",
        staff: ["John Smith", "Emma Wilson"],
        condition: 8
      },
      {
        id: "CB-002",
        customer: "Bob Williams",
        vehicle: "Tesla Model 3",
        packageType: "elite",
        date: yesterday,
        time: "11:00",
        startTime: "11:00",
        endTime: "14:00",
        location: "Customer's Location",
        status: "completed",
        totalPrice: 199,
        notes: "Vehicle has heavy scratching on driver's side",
        staff: ["Sarah Johnson", "Michael Brown"],
        condition: 3
      }
    ];
  };

  // Update booking in the appropriate list
  const updateBooking = (booking: Booking): Booking[] => {
    const isConfirmed = booking.status === 'confirmed' || 
                        booking.status === 'in-progress' || 
                        booking.status === 'completed' ||
                        booking.status === 'finished';
                        
    if (isConfirmed) {
      const updatedBookings = confirmedBookings.map(b => 
        b.id === booking.id ? booking : b
      );
      setConfirmedBookings(updatedBookings);
      saveBookingsToStorage('confirmed', updatedBookings);
      return updatedBookings;
    } else {
      const updatedBookings = pendingBookings.map(b => 
        b.id === booking.id ? booking : b
      );
      setPendingBookings(updatedBookings);
      saveBookingsToStorage('pending', updatedBookings);
      return updatedBookings;
    }
  };

  // Move booking from pending to confirmed
  const moveBookingToConfirmed = (booking: Booking): void => {
    const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPending);
    saveBookingsToStorage('pending', updatedPending);
    
    const updatedConfirmed = [...confirmedBookings, booking];
    setConfirmedBookings(updatedConfirmed);
    saveBookingsToStorage('confirmed', updatedConfirmed);
  };

  // Delete booking
  const deleteBooking = (booking: Booking): void => {
    const isConfirmed = booking.status === 'confirmed' || 
                       booking.status === 'in-progress' || 
                       booking.status === 'completed' ||
                       booking.status === 'finished';
                       
    if (isConfirmed) {
      const updatedBookings = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedBookings);
      saveBookingsToStorage('confirmed', updatedBookings);
    } else {
      const updatedBookings = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedBookings);
      saveBookingsToStorage('pending', updatedBookings);
    }
  };

  return {
    pendingBookings,
    setPendingBookings,
    confirmedBookings,
    setConfirmedBookings,
    date,
    setDate,
    view,
    setView,
    updateBooking,
    moveBookingToConfirmed,
    deleteBooking,
    saveBookingsToStorage,
    loadBookingsFromStorage
  };
};
