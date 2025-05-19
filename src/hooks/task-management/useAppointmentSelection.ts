
import { useEffect } from 'react';
import { Booking } from "@/types/booking";
import { ServiceTaskItem } from "@/types/task";
import { useServiceTaskGenerator } from './useServiceTaskGenerator';

export const useAppointmentSelection = (
  selectedAppointment: string,
  bookingIdFromUrl: string | null,
  appointments: Booking[],
  setSelectedAppointment: (id: string) => void,
  setCurrentBooking: (booking: Booking | null) => void,
  setServiceTasks: (tasks: ServiceTaskItem[]) => void
) => {
  const { generateServiceTasksFromPackage, loadSavedProgress } = useServiceTaskGenerator();

  // Auto-select the booking from URL if available
  useEffect(() => {
    if (bookingIdFromUrl && appointments.length > 0) {
      const booking = appointments.find(app => app.id === bookingIdFromUrl);
      if (booking) {
        setSelectedAppointment(bookingIdFromUrl);
      }
    }
  }, [bookingIdFromUrl, appointments, setSelectedAppointment]);

  // Handle appointment selection
  useEffect(() => {
    if (selectedAppointment) {
      const booking = appointments.find(app => app.id === selectedAppointment);
      if (booking) {
        setCurrentBooking(booking);
        const generatedTasks = generateServiceTasksFromPackage(booking);
        const tasksWithProgress = loadSavedProgress(booking, generatedTasks);
        setServiceTasks(tasksWithProgress);
      }
    } else {
      setCurrentBooking(null);
      setServiceTasks([]);
    }
  }, [selectedAppointment, appointments, setCurrentBooking, setServiceTasks]);
};
