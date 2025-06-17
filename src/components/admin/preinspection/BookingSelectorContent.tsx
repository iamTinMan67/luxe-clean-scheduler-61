
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Booking } from "@/types/booking";
import BookingSelectItem from "./BookingSelectItem";

interface BookingSelectorContentProps {
  isActuallyLoading: boolean;
  hasAppointments: boolean;
  todayAppointments: Booking[];
}

const BookingSelectorContent = ({
  isActuallyLoading,
  hasAppointments,
  todayAppointments
}: BookingSelectorContentProps) => {
  return (
    <SelectContent className="bg-gray-900 border-gold/30 text-white max-h-[300px] overflow-y-auto z-[100]">
      {isActuallyLoading ? (
        <SelectItem value="loading" disabled>Loading appointments...</SelectItem>
      ) : hasAppointments ? (
        todayAppointments.map((booking) => (
          <BookingSelectItem key={booking.id} booking={booking} />
        ))
      ) : (
        <SelectItem value="none" disabled>
          No confirmed appointments scheduled for today
        </SelectItem>
      )}
    </SelectContent>
  );
};

export default BookingSelectorContent;
