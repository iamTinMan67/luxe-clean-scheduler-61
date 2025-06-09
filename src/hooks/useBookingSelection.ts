
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Booking } from "@/types/booking";
import { useTodoAppointments } from "./useTodoAppointments";

export const useBookingSelection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingIdFromUrl = queryParams.get('bookingId');
  
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  
  const {
    appointments,
    allAppointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  } = useTodoAppointments();

  // Auto-select the booking from URL if available
  useEffect(() => {
    if (bookingIdFromUrl && allAppointments.length > 0) {
      const booking = allAppointments.find(app => app.id === bookingIdFromUrl);
      if (booking) {
        setSelectedAppointment(bookingIdFromUrl);
      }
    }
  }, [bookingIdFromUrl, allAppointments]);

  // Handle appointment selection
  useEffect(() => {
    if (selectedAppointment) {
      const booking = allAppointments.find(app => app.id === selectedAppointment);
      if (booking) {
        setCurrentBooking(booking);
      }
    } else {
      setCurrentBooking(null);
    }
  }, [selectedAppointment, allAppointments]);

  return {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  };
};
