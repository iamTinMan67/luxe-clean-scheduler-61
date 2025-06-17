
import { Select } from "@/components/ui/select";
import { Booking } from "@/types/booking";
import { getTodayString } from "@/utils/dateParsingUtils";
import { useBookingSelectorState } from "@/hooks/preinspection/useBookingSelectorState";
import BookingSelectorDebug from "./BookingSelectorDebug";
import BookingSelectorTrigger from "./BookingSelectorTrigger";
import BookingSelectorContent from "./BookingSelectorContent";

interface BookingSelectorProps {
  appointments: Booking[];
  loading: boolean;
  selectedBooking: string;
  onBookingChange: (value: string) => void;
}

const BookingSelector = ({
  appointments,
  loading,
  selectedBooking,
  onBookingChange,
}: BookingSelectorProps) => {
  const {
    todayAppointments,
    isActuallyLoading,
    hasAppointments,
    placeholderText
  } = useBookingSelectorState({ appointments, loading });

  console.log("BookingSelector render state:", {
    loading,
    isActuallyLoading,
    appointmentsLength: appointments.length,
    todayAppointmentsLength: todayAppointments.length,
    hasAppointments,
    placeholderText
  });

  return (
    <div>
      <label htmlFor="customer" className="text-white text-sm font-medium block mb-1">
        Today's Appointments ({getTodayString()})
      </label>
      <Select
        value={selectedBooking}
        onValueChange={onBookingChange}
        disabled={isActuallyLoading}
      >
        <BookingSelectorTrigger placeholderText={placeholderText} />
        <BookingSelectorContent 
          isActuallyLoading={isActuallyLoading}
          hasAppointments={hasAppointments}
          todayAppointments={todayAppointments}
        />
      </Select>
      
      <BookingSelectorDebug 
        appointments={appointments} 
        todayAppointments={todayAppointments} 
      />
    </div>
  );
};

export default BookingSelector;
