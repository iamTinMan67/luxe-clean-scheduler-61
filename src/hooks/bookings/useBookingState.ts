
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
        // Add demo data if no valid data exists
        setPendingBookings(getDemoPendingBookings());
      }
    } else {
      // Add demo data if no data exists
      setPendingBookings(getDemoPendingBookings());
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
        // Add demo data if no valid data exists
        setConfirmedBookings(getDemoConfirmedBookings());
      }
    } else {
      // Add demo data if no data exists
      setConfirmedBookings(getDemoConfirmedBookings());
    }
  }, []);

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
        notes: "Customer prefers contactless service",
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
