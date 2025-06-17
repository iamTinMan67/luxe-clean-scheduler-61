
import { Booking } from "@/types/booking";
import { filterTodayAppointments } from "@/utils/bookingFilterUtils";

interface UseBookingSelectorStateProps {
  appointments: Booking[];
  loading: boolean;
}

export const useBookingSelectorState = ({ appointments, loading }: UseBookingSelectorStateProps) => {
  const todayAppointments = filterTodayAppointments(appointments);
  
  // Determine the actual state based on data availability
  const isActuallyLoading = loading || (!appointments.length && loading !== false);
  const hasAppointments = todayAppointments.length > 0;

  // Determine placeholder text
  const getPlaceholderText = () => {
    if (isActuallyLoading) {
      return "Loading appointments...";
    }
    if (hasAppointments) {
      return "Select today's appointment";
    }
    return "No appointments available for today";
  };

  return {
    todayAppointments,
    isActuallyLoading,
    hasAppointments,
    placeholderText: getPlaceholderText()
  };
};
