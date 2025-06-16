
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

  // Enhanced filtering with more comprehensive status checking
  const todayAppointments = appointments.filter(booking => {
    console.log("=== BookingSelector Filter Debug ===");
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
    // More flexible status checking - include various confirmed statuses
    const isValidStatus = booking.status === "confirmed" || 
                         booking.status === "inspecting" || 
                         booking.status === "inspected" ||
                         booking.status === "in-progress";
    
    console.log("Booking filter check:", {
      id: booking.id,
      customer: booking.customer,
      isToday,
      isValidStatus,
      status: booking.status,
      shouldInclude: isToday && isValidStatus
    });

    return isToday && isValidStatus;
  });

  console.log("=== BookingSelector Final Results ===");
  console.log("Total appointments received:", appointments.length);
  console.log("All appointment statuses:", appointments.map(a => `${a.customer}:${a.status}`));
  console.log("Today's valid appointments:", todayAppointments.length);
  console.log("Today's date:", getTodayString());
  console.log("Valid appointments for today:", todayAppointments.map(a => ({
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
                {booking.customer} - {booking.time} - {booking.packageType} ({booking.status})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No confirmed appointments scheduled for today
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {/* Enhanced debug information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <div>Debug: {appointments.length} total, {todayAppointments.length} today valid</div>
          <div>All statuses: {appointments.map(a => `${a.customer}:${a.status}`).join(', ')}</div>
          <div>Today filter: {appointments.filter(a => isSameDay(a.date, new Date())).length} appointments today</div>
          <div>Confirmed filter: {appointments.filter(a => a.status === 'confirmed').length} confirmed appointments</div>
        </div>
      )}
    </div>
  );
};

export default BookingSelector;
