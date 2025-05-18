
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking } from "@/types/booking";

interface BookingSelectorProps {
  value: string;
  onChange: (value: string) => void;
  appointments: Booking[];
  loading: boolean;
}

const BookingSelector = ({ value, onChange, appointments, loading }: BookingSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[240px] bg-black/50 border-gold/30">
        <SelectValue placeholder="Select an appointment" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gold/30 text-white">
        {loading ? (
          <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
        ) : appointments.length > 0 ? (
          appointments.map((booking) => (
            <SelectItem key={booking.id} value={booking.id}>
              {booking.customer} - {booking.vehicle}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>No appointments found</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default BookingSelector;
