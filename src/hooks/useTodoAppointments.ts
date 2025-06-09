
import { useState, useEffect, useMemo } from 'react';
import { useScheduledAppointments } from './useScheduledAppointments';
import { Booking } from '@/types/booking';

export const useTodoAppointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get only inspected bookings
  const { appointments, loading } = useScheduledAppointments(['inspected']);

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

  return {
    appointments: filteredAppointments,
    allAppointments: appointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  };
};
