
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

  const parseBookingDate = (dateInput: any): Date | null => {
    console.log("Parsing date input:", dateInput, "Type:", typeof dateInput);
    
    try {
      // Handle null/undefined
      if (!dateInput) {
        console.log("Date input is null/undefined");
        return null;
      }

      // Handle Date object
      if (dateInput instanceof Date) {
        console.log("Date is already a Date object:", dateInput);
        return dateInput;
      }

      // Handle ISO string
      if (typeof dateInput === 'string') {
        console.log("Date is string, parsing:", dateInput);
        const parsed = new Date(dateInput);
        console.log("Parsed string date:", parsed);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      // Handle complex nested object structure
      if (typeof dateInput === 'object') {
        console.log("Date is object, checking nested structure");
        
        // Check for nested value.iso structure
        if (dateInput.value && dateInput.value.iso) {
          console.log("Found nested value.iso:", dateInput.value.iso);
          const parsed = new Date(dateInput.value.iso);
          console.log("Parsed nested iso date:", parsed);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
        
        // Check for direct iso property
        if (dateInput.iso) {
          console.log("Found direct iso:", dateInput.iso);
          const parsed = new Date(dateInput.iso);
          console.log("Parsed direct iso date:", parsed);
          return isNaN(parsed.getTime()) ? null : parsed;
        }

        // Check for value property with timestamp
        if (dateInput.value && typeof dateInput.value === 'number') {
          console.log("Found timestamp value:", dateInput.value);
          const parsed = new Date(dateInput.value);
          console.log("Parsed timestamp date:", parsed);
          return isNaN(parsed.getTime()) ? null : parsed;
        }

        // Try to convert object to string and parse
        const dateStr = dateInput.toString();
        if (dateStr !== '[object Object]') {
          console.log("Converting object to string:", dateStr);
          const parsed = new Date(dateStr);
          console.log("Parsed object string date:", parsed);
          return isNaN(parsed.getTime()) ? null : parsed;
        }
      }

      console.log("Could not parse date:", dateInput);
      return null;
    } catch (error) {
      console.error("Error parsing date:", error, dateInput);
      return null;
    }
  };

  const isSameDay = (bookingDate: any, targetDate: Date): boolean => {
    const parsedDate = parseBookingDate(bookingDate);
    if (!parsedDate) {
      console.log("Could not parse booking date for comparison");
      return false;
    }
    
    const isSame = parsedDate.toDateString() === targetDate.toDateString();
    console.log("Date comparison:", {
      bookingDate: parsedDate.toDateString(),
      targetDate: targetDate.toDateString(),
      isSame
    });
    
    return isSame;
  };

  // Safe field access with proper fallbacks - handle both customer and yourName fields
  const getDisplayTime = (booking: Booking): string => {
    return booking.time || booking.startTime || "Time TBD";
  };

  const getDisplayPackage = (booking: Booking): string => {
    return booking.packageType || "Package TBD";
  };

  const getDisplayStatus = (booking: Booking): string => {
    return booking.status || "pending";
  };

  const getDisplayCustomer = (booking: Booking): string => {
    // Handle both customer and yourName fields (legacy data compatibility)
    const customerName = booking.customer || (booking as any).yourName || "Unknown Customer";
    return customerName.replace(/^:/, '').replace(/:$/, ''); // Remove leading/trailing colons
  };

  const getDisplayVehicle = (booking: Booking): string => {
    return booking.vehicle || booking.jobDetails || "Unknown Vehicle";
  };

  // Enhanced filtering with more comprehensive status checking
  const todayAppointments = appointments.filter(booking => {
    console.log("=== BookingSelector Filter Debug ===");
    console.log("Processing booking:", {
      id: booking.id,
      customer: getDisplayCustomer(booking),
      date: booking.date,
      status: booking.status,
      dateType: typeof booking.date,
      rawDate: booking.date
    });

    try {
      const today = new Date();
      const isToday = isSameDay(booking.date, today);
      // More flexible status checking - include various confirmed statuses
      const isValidStatus = booking.status === "confirmed" || 
                           booking.status === "inspecting" || 
                           booking.status === "inspected" ||
                           booking.status === "in-progress";
      
      console.log("Booking filter check:", {
        id: booking.id,
        customer: getDisplayCustomer(booking),
        isToday,
        isValidStatus,
        status: booking.status,
        shouldInclude: isToday && isValidStatus
      });

      return isToday && isValidStatus;
    } catch (error) {
      console.error("Error processing booking date:", error, booking);
      return false;
    }
  });

  console.log("=== BookingSelector Final Results ===");
  console.log("Total appointments received:", appointments.length);
  console.log("All appointment statuses:", appointments.map(a => `${getDisplayCustomer(a)}:${a.status}`));
  console.log("Today's valid appointments:", todayAppointments.length);
  console.log("Today's date:", getTodayString());
  console.log("Valid appointments for today:", todayAppointments.map(a => ({
    id: a.id,
    customer: getDisplayCustomer(a),
    status: a.status,
    date: a.date,
    time: getDisplayTime(a),
    packageType: getDisplayPackage(a),
    vehicle: getDisplayVehicle(a)
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
            todayAppointments.map((booking) => {
              console.log("Rendering booking item:", {
                id: booking.id,
                customer: getDisplayCustomer(booking),
                time: getDisplayTime(booking),
                vehicle: getDisplayVehicle(booking)
              });
              return (
                <SelectItem 
                  key={booking.id} 
                  value={booking.id}
                  className="focus:bg-gray-800 focus:text-white data-[highlighted]:bg-gray-800 data-[highlighted]:text-white"
                >
                  <div className="flex flex-col text-left w-full min-w-0">
                    <span className="font-medium text-white truncate">
                      {getDisplayCustomer(booking)} - {getDisplayTime(booking)}
                    </span>
                    <span className="text-xs text-gray-300 truncate">
                      {getDisplayVehicle(booking)} | {getDisplayPackage(booking)} | {getDisplayStatus(booking)}
                    </span>
                  </div>
                </SelectItem>
              );
            })
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
      )}
    </div>
  );
};

export default BookingSelector;
