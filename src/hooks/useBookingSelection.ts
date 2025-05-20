
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScheduledAppointments } from "@/hooks/useScheduledAppointments";
import { Booking } from "@/types/booking";

export const useBookingSelection = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const { appointments, loading } = useScheduledAppointments();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingIdFromUrl = queryParams.get('bookingId');
  
  // Auto-select the booking from URL if available
  useEffect(() => {
    if (bookingIdFromUrl && appointments.length > 0) {
      const booking = appointments.find(app => app.id === bookingIdFromUrl);
      if (booking) {
        setSelectedAppointment(bookingIdFromUrl);
      }
    }
  }, [bookingIdFromUrl, appointments]);

  // Handle appointment selection
  useEffect(() => {
    if (selectedAppointment) {
      const booking = appointments.find(app => app.id === selectedAppointment);
      if (booking) {
        setCurrentBooking(booking);
      }
    } else {
      setCurrentBooking(null);
    }
  }, [selectedAppointment, appointments]);

  return {
    selectedAppointment,
    setSelectedAppointment,
    currentBooking,
    appointments,
    loading
  };
};
