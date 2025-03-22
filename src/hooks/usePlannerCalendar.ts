
import { useState, useEffect } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { toast } from "sonner";
import { Booking, validateBookingStatus } from '@/types/booking';
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';

export const usePlannerCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load saved bookings from localStorage on component mount
  useEffect(() => {
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

    const savedConfirmedBookings = localStorage.getItem('confirmedBookings');
    if (savedConfirmedBookings) {
      try {
        const parsedBookings = JSON.parse(savedConfirmedBookings).map((booking: any) => ({
          ...booking,
          date: new Date(booking.date),
          status: validateBookingStatus(booking.status)
        }));
        setConfirmedBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
  }, []);
  
  // Filter events for the selected date - include both confirmed and pending
  const filteredBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    return isSameDay(bookingDate, date);
  });
  
  // Get schedule for the selected view - include both confirmed and pending
  const getScheduleForView = () => {
    let daysToShow: Date[];
    
    if (view === "daily") {
      daysToShow = [date];
    } else {
      // Weekly view
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
      const end = endOfWeek(date, { weekStartsOn: 1 });
      daysToShow = eachDayOfInterval({ start, end });
    }
    
    return daysToShow.map(day => {
      const dayBookings = [...confirmedBookings, ...pendingBookings].filter(booking => {
        const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
        return isSameDay(bookingDate, day);
      });
      
      return {
        date: day,
        bookings: dayBookings
      };
    });
  };
  
  const schedule = getScheduleForView();
  
  // Navigation for day/week
  const navigatePrevious = () => {
    setDate(prev => 
      view === "daily" ? addDays(prev, -1) : addDays(prev, -7)
    );
  };
  
  const navigateNext = () => {
    setDate(prev => 
      view === "daily" ? addDays(prev, 1) : addDays(prev, 7)
    );
  };
  
  const navigateToday = () => {
    setDate(new Date());
  };
  
  // Handle booking confirmation
  const handleConfirmBooking = (bookingId: string) => {
    // Find the booking to confirm
    const bookingToConfirm = pendingBookings.find(booking => booking.id === bookingId);
    if (!bookingToConfirm) return;
    
    // Create a confirmed booking from the pending booking
    const confirmedBooking: Booking = {
      ...bookingToConfirm,
      status: "confirmed",
      startTime: bookingToConfirm.time,
      endTime: bookingToConfirm.time ? 
        `${parseInt(bookingToConfirm.time.split(':')[0]) + 2}:${bookingToConfirm.time.split(':')[1]}` : 
        "12:00", // Default 2 hours later
      staff: ["James Carter", "Michael Scott"] // Default staff assignment
    };
    
    // Update the confirmed bookings
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    
    // Update the pending bookings list
    const updatedPendingBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedPendingBookings);
    
    // Update localStorage by storing the updated pending bookings
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Store confirmed bookings separately in localStorage
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Generate invoice for the confirmed booking
    generateInvoice(confirmedBooking);
    
    // Show success message
    toast.success(`Booking ${bookingId} confirmed successfully!`, {
      description: "The booking has been added to your schedule."
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    // Update the bookings state by removing the cancelled booking
    const updatedBookings = pendingBookings.filter(booking => booking.id !== bookingId);
    setPendingBookings(updatedBookings);
    
    // Update localStorage
    localStorage.setItem('pendingBookings', JSON.stringify(updatedBookings));
    
    // Show success message
    toast.success(`Booking ${bookingId} cancelled successfully!`);
  };
  
  // Get background color based on vehicle condition
  const getBookingBackground = (booking: Booking) => {
    if (booking.status === "pending") return "bg-amber-900/30 border-amber-700";
    if (booking.condition !== undefined && booking.condition < 5) return "bg-orange-800 border-orange-700";
    return "bg-gray-800 border-gray-700";
  };

  return {
    date,
    setDate,
    view,
    setView,
    pendingBookings,
    confirmedBookings,
    filteredBookings,
    schedule,
    navigatePrevious,
    navigateNext,
    navigateToday,
    handleConfirmBooking,
    handleCancelBooking,
    getBookingBackground
  };
};
