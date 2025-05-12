
import { useState } from 'react';
import { Booking } from '@/types/booking';
import { PlannerViewType } from './usePlannerCalendar';

export const useBookings = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<PlannerViewType>("daily");
  
  // Get bookings for selected date
  const getBookingsForDate = (): Booking[] => {
    const bookingsForDate = [...confirmedBookings, ...pendingBookings].filter(booking => {
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      return bookingDate.getDate() === date.getDate() &&
             bookingDate.getMonth() === date.getMonth() &&
             bookingDate.getFullYear() === date.getFullYear();
    });
    
    return bookingsForDate;
  };
  
  // Confirm booking
  const handleConfirmBooking = (booking: Booking) => {
    const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
    setPendingBookings(updatedPending);
    
    const bookingToConfirm = { ...booking, status: "confirmed" as const };
    setConfirmedBookings([...confirmedBookings, bookingToConfirm]);
  };
  
  // Delete booking
  const handleDeleteBooking = (booking: Booking) => {
    if (booking.status === "pending") {
      const updatedPending = pendingBookings.filter(b => b.id !== booking.id);
      setPendingBookings(updatedPending);
    } else {
      const updatedConfirmed = confirmedBookings.filter(b => b.id !== booking.id);
      setConfirmedBookings(updatedConfirmed);
    }
  };
  
  // Change package
  const handlePackageChange = (booking: Booking, newPackage: string) => {
    if (booking.status === "pending") {
      const updatedPending = pendingBookings.map(b => {
        if (b.id === booking.id) {
          return { ...b, package: newPackage };
        }
        return b;
      });
      setPendingBookings(updatedPending);
    } else {
      const updatedConfirmed = confirmedBookings.map(b => {
        if (b.id === booking.id) {
          return { ...b, package: newPackage };
        }
        return b;
      });
      setConfirmedBookings(updatedConfirmed);
    }
  };
  
  // Reschedule booking
  const handleReschedule = (booking: Booking, newDate: Date) => {
    if (booking.status === "pending") {
      const updatedPending = pendingBookings.map(b => {
        if (b.id === booking.id) {
          return { ...b, date: newDate };
        }
        return b;
      });
      setPendingBookings(updatedPending);
    } else {
      const updatedConfirmed = confirmedBookings.map(b => {
        if (b.id === booking.id) {
          return { ...b, date: newDate };
        }
        return b;
      });
      setConfirmedBookings(updatedConfirmed);
    }
  };
  
  // Complete booking
  const handleCompleteBooking = (booking: Booking) => {
    const updatedConfirmed = confirmedBookings.map(b => {
      if (b.id === booking.id) {
        return { ...b, status: "completed" as const };
      }
      return b;
    });
    setConfirmedBookings(updatedConfirmed);
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
