
import { useState, useEffect, useMemo } from 'react';
import { useScheduledAppointments } from './useScheduledAppointments';
import { Booking } from '@/types/booking';

export const useTodoAppointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Only get inspected bookings for task management (updated requirement)
  const { appointments, loading } = useScheduledAppointments(['inspected']);

  console.log('=== TodoAppointments Debug ===');
  console.log('Raw appointments from useScheduledAppointments:', appointments.length);
  console.log('Appointment statuses:', appointments.map(a => `${a.customer}:${a.status}`));

  // Filter appointments by date and search term
  const filteredAppointments = useMemo(() => {
    const filtered = appointments.filter(booking => {
      console.log('Processing booking for date filter:', {
        id: booking.id,
        customer: booking.customer,
        status: booking.status,
        date: booking.date,
        selectedDate: selectedDate
      });

      // Date filter
      const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
      const dateMatches = 
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear();

      // Search filter (customer name)
      const searchMatches = searchTerm === '' || 
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase());

      const shouldInclude = dateMatches && searchMatches;
      console.log('Filter result:', { dateMatches, searchMatches, shouldInclude });

      return shouldInclude;
    });

    console.log('=== TodoAppointments Final Results ===');
    console.log('Filtered appointments:', filtered.length);
    console.log('Selected date:', selectedDate.toDateString());
    console.log('Search term:', searchTerm);
    console.log('Final appointments:', filtered.map(a => ({
      id: a.id,
      customer: a.customer,
      status: a.status,
      date: a.date
    })));

    return filtered;
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
