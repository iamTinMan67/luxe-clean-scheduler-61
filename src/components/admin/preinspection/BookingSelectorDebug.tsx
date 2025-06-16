
import { Booking } from "@/types/booking";
import { isSameDay } from "@/utils/dateParsingUtils";
import { getDisplayCustomer } from "@/utils/bookingDisplayHelpers";

interface BookingSelectorDebugProps {
  appointments: Booking[];
  todayAppointments: Booking[];
}

const BookingSelectorDebug = ({ appointments, todayAppointments }: BookingSelectorDebugProps) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-2 text-xs text-gray-400 space-y-1">
      <div>Debug: {appointments.length} total, {todayAppointments.length} today valid</div>
      <div>All statuses: {appointments.map(a => `${getDisplayCustomer(a)}:${a.status}`).join(', ')}</div>
      <div>Today filter: {appointments.filter(a => {
        try {
          return isSameDay(a.date, new Date());
        } catch {
          return false;
        }
      }).length} appointments today</div>
      <div>Confirmed filter: {appointments.filter(a => a.status === 'confirmed').length} confirmed appointments</div>
      <div>Sample booking IDs: {todayAppointments.map(a => a.id).join(', ')}</div>
      <div>Rendering {todayAppointments.length} dropdown items</div>
    </div>
  );
};

export default BookingSelectorDebug;
