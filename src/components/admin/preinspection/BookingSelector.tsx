
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types/booking";

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
  // Enhanced date comparison for today's bookings
  const getTodayString = () => {
    const today = new Date();
    return today.toDateString();
  };

  const isSameDay = (date1: Date | string, date2: Date) => {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2;
    return d1.toDateString() === d2.toDateString();
  };

  // Filter appointments with enhanced logic and debugging
  const todayAppointments = appointments.filter(booking => {
    console.log("Processing booking:", {
      id: booking.id,
      customer: booking.customer,
      date: booking.date,
      status: booking.status,
      dateType: typeof booking.date,
      dateString: booking.date instanceof Date ? booking.date.toDateString() : new Date(booking.date).toDateString()
    });

    const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
    const today = new Date();
    
    const isToday = isSameDay(bookingDate, today);
    const isConfirmed = booking.status === "confirmed";
    
    console.log("Booking filter check:", {
      id: booking.id,
      isToday,
      isConfirmed,
      shouldInclude: isToday && isConfirmed
    });

    return isToday && isConfirmed;
  });

  console.log("=== BookingSelector Debug ===");
  console.log("Total appointments received:", appointments.length);
  console.log("Today's confirmed appointments:", todayAppointments.length);
  console.log("Today's date:", getTodayString());
  console.log("Confirmed appointments for today:", todayAppointments.map(a => ({
    id: a.id,
    customer: a.customer,
    status: a.status,
    date: a.date
  })));

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
          <SelectValue placeholder="Select today's appointment" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gold/30 text-white">
          {loading ? (
            <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
          ) : todayAppointments.length > 0 ? (
            todayAppointments.map((booking) => (
              <SelectItem key={booking.id} value={booking.id}>
                {booking.customer} - {booking.time} - {booking.packageType}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No confirmed appointments scheduled for today
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {/* Debug information - only shown in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-400">
          Debug: {appointments.length} total, {todayAppointments.length} today confirmed
          <br />
          All statuses: {appointments.map(a => `${a.customer}:${a.status}`).join(', ')}
        </div>
      )}
    </div>
  );
};

export default BookingSelector;
