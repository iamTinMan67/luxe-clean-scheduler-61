
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types/booking";
import { getTodayString } from "@/utils/dateParsingUtils";
import { filterTodayAppointments } from "@/utils/bookingFilterUtils";
import BookingSelectorDebug from "./BookingSelectorDebug";
import BookingSelectItem from "./BookingSelectItem";

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
  const todayAppointments = filterTodayAppointments(appointments);

  return (
    <div>
      <label htmlFor="customer" className="text-white text-sm font-medium block mb-1">
        Today's Appointments ({getTodayString()})
      </label>
      <Select
        value={selectedBooking}
        onValueChange={onBookingChange}
      >
        <SelectTrigger className="bg-black/40 border-gold/30 text-white">
          <SelectValue placeholder={
            loading 
              ? "Loading appointments..." 
              : todayAppointments.length > 0 
                ? "Select today's appointment" 
                : "No appointments available for today"
          } />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gold/30 text-white max-h-[300px] overflow-y-auto z-[100]">
          {loading ? (
            <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
          ) : todayAppointments.length > 0 ? (
            todayAppointments.map((booking) => (
              <BookingSelectItem key={booking.id} booking={booking} />
            ))
          ) : (
            <SelectItem value="none" disabled>
              No confirmed appointments scheduled for today
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      <BookingSelectorDebug 
        appointments={appointments} 
        todayAppointments={todayAppointments} 
      />
    </div>
  );
};

export default BookingSelector;
