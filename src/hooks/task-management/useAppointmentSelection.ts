
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
  setServiceTasks: (tasks: ServiceTaskItem[]) => void,
  taskProgress: {[bookingId: string]: number},
  updateTaskProgress: (bookingId: string, progress: number) => void
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

  // Handle appointment selection and progress tracking
  useEffect(() => {
    if (selectedAppointment) {
      const booking = appointments.find(app => app.id === selectedAppointment);
      if (booking) {
        setCurrentBooking(booking);
        const generatedTasks = generateServiceTasksFromPackage(booking);
        const tasksWithProgress = loadSavedProgress(booking, generatedTasks);
        setServiceTasks(tasksWithProgress);
        
        // Calculate and update progress for this booking
        const completedTasks = tasksWithProgress.filter(task => task.completed).length;
        const totalTasks = tasksWithProgress.length;
        const progressPercentage = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
        
        // Update progress if it's different from what's already stored
        if (taskProgress[booking.id] !== progressPercentage) {
          updateTaskProgress(booking.id, progressPercentage);
        }
      }
    } else {
      setCurrentBooking(null);
      setServiceTasks([]);
    }
  }, [selectedAppointment, appointments, setCurrentBooking, setServiceTasks]);

  // Helper function to check if a booking is complete
  const isBookingComplete = (bookingId: string): boolean => {
    return taskProgress[bookingId] === 100;
  };

  return {
    isBookingComplete
  };
};
