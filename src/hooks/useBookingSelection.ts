
import { useState, useEffect, useMemo } from 'react';
import { Booking } from '@/types/booking';
import { useTodoAppointments } from './useTodoAppointments';

export const useBookingSelection = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get inspected appointments for todo list
  const { 
    appointments, 
    loading 
  } = useTodoAppointments();

  // Filter appointments by date and search term
  const filteredAppointments = useMemo(() => {
    return appointments.filter(booking => {
      // Date filter
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      const dateMatches = 
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear();

      // Search filter (customer name)
      const searchMatches = searchTerm === '' || 
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase());

      return dateMatches && searchMatches;
    });
  }, [appointments, selectedDate, searchTerm]);

  // Find current booking from selection
  const currentBooking = useMemo(() => {
    return filteredAppointments.find(booking => booking.id === selectedAppointment) || null;
  }, [filteredAppointments, selectedAppointment]);

  // Auto-select booking from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = urlParams.get('bookingId');
    
    if (bookingIdFromUrl && !selectedAppointment) {
      // Check if this booking exists in our appointments
      const bookingExists = filteredAppointments.find(booking => booking.id === bookingIdFromUrl);
      if (bookingExists) {
        setSelectedAppointment(bookingIdFromUrl);
        console.log('Auto-selected booking from URL:', bookingIdFromUrl);
      }
    }
  }, [filteredAppointments, selectedAppointment]);

  return {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments: filteredAppointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  };
};
