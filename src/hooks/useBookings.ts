
import { useState, useEffect } from 'react';
import { Booking, validateBookingStatus } from '@/types/booking';
import { generateInvoice, sendNotification } from '@/utils/bookingUtils';
import { toast } from 'sonner';

export const useBookings = () => {
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

  // Get all bookings for the selected date
  const getBookingsForDate = () => {
    const allBookings = [...confirmedBookings, ...pendingBookings];
    
    return allBookings.filter(booking => {
      const bookingDate = booking.date instanceof Date 
        ? booking.date 
        : new Date(booking.date);
      
      return date && 
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Handle booking confirmation
  const handleConfirmBooking = (booking: Booking) => {
    // Create a confirmed booking
    const confirmedBooking: Booking = {
      ...booking,
      status: "confirmed",
      startTime: booking.time,
      endTime: booking.time 
        ? `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}` 
        : "12:00",
      staff: ["James Carter", "Michael Scott"]
    };
    
    // Add to confirmed bookings
    const updatedConfirmedBookings = [...confirmedBookings, confirmedBooking];
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Remove from pending
    const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPendingBookings);
    localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    
    // Generate invoice
    generateInvoice(confirmedBooking);
    
    toast.success("Booking confirmed", {
      description: `Booking for ${booking.customer} has been confirmed.`
    });
  };
  
  // Handle booking deletion
  const handleDeleteBooking = (booking: Booking) => {
    if (booking.status === "pending") {
      // Remove from pending
      const updatedPendingBookings = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      // Remove from confirmed
      const updatedConfirmedBookings = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    toast.success("Booking deleted", {
      description: `Booking for ${booking.customer} has been deleted.`
    });
  };
  
  // Handle package change
  const handlePackageChange = (booking: Booking, newPackageType: string) => {
    if (!newPackageType) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      packageType: newPackageType
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Generate new invoice if it's a confirmed booking
    if (updatedBooking.status === "confirmed") {
      // Remove old invoice
      const existingInvoices = localStorage.getItem('invoices') 
        ? JSON.parse(localStorage.getItem('invoices') || '[]') 
        : [];
      
      const filteredInvoices = existingInvoices.filter((inv: any) => inv.id !== updatedBooking.id);
      localStorage.setItem('invoices', JSON.stringify(filteredInvoices));
      
      // Generate new invoice
      generateInvoice(updatedBooking);
      
      // Send notification
      sendNotification(updatedBooking, "update");
    }
    
    toast.success("Package updated", {
      description: `Package updated to ${newPackageType} for ${updatedBooking.customer}`
    });
  };
  
  // Handle date reschedule
  const handleReschedule = (booking: Booking, rescheduledDate: Date) => {
    if (!rescheduledDate) return;
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      date: rescheduledDate
    };
    
    // Update in the appropriate list
    if (updatedBooking.status === "pending") {
      const updatedPendingBookings = pendingBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setPendingBookings(updatedPendingBookings);
      localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
    } else {
      const updatedConfirmedBookings = confirmedBookings.map(b => 
        b.id === updatedBooking.id ? updatedBooking : b
      );
      setConfirmedBookings(updatedConfirmedBookings);
      localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    }
    
    // Send notification if confirmed
    if (updatedBooking.status === "confirmed") {
      sendNotification(updatedBooking, "update");
    }
    
    toast.success("Booking rescheduled", {
      description: `Booking rescheduled to ${rescheduledDate.toLocaleDateString()} for ${updatedBooking.customer}`
    });
  };
  
  // Mark booking as completed
  const handleCompleteBooking = (booking: Booking) => {
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      status: "completed"
    };
    
    // Update in confirmed bookings
    const updatedConfirmedBookings = confirmedBookings.map(b => 
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setConfirmedBookings(updatedConfirmedBookings);
    localStorage.setItem('confirmedBookings', JSON.stringify(updatedConfirmedBookings));
    
    // Send completion notification with feedback link
    sendNotification(updatedBooking, "completion");
    
    toast.success("Booking completed", {
      description: `Service for ${updatedBooking.customer} has been marked as completed.`
    });
  };

  return {
    pendingBookings,
    confirmedBookings,
    date,
    setDate,
    view,
    setView,
    getBookingsForDate,
    handleConfirmBooking,
    handleDeleteBooking,
    handlePackageChange,
    handleReschedule,
    handleCompleteBooking
  };
};
