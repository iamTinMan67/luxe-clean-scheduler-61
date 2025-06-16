
import { useState, useEffect, useMemo } from 'react';
import { useTodoAppointments } from './useTodoAppointments';
import { Booking } from '@/types/booking';
import { useBookingStateManager } from './bookings/useBookingStateManager';
import { toast } from 'sonner';

export const useBookingSelection = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const { updateBooking } = useBookingStateManager();
  
  const {
    appointments,
    loading,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm
  } = useTodoAppointments();

  // Find the current booking from the selected appointment ID
  const currentBooking = useMemo(() => {
    if (!selectedAppointment) return null;
    return appointments.find(booking => booking.id === selectedAppointment) || null;
  }, [selectedAppointment, appointments]);

  // Effect to automatically change status from "inspected" to "in-progress" when booking is loaded
  useEffect(() => {
    const handleStatusChange = async () => {
      if (currentBooking && currentBooking.status === "inspected") {
        console.log("Auto-changing status from inspected to in-progress for:", currentBooking.customer);
        const updatedBooking = { ...currentBooking, status: "in-progress" as const };
        await updateBooking(updatedBooking);
        toast.success(`${currentBooking.customer}'s appointment status changed to In Progress.`);
      }
    };

    handleStatusChange();
  }, [currentBooking?.id, currentBooking?.status, updateBooking]);

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
