
import { SelectItem } from "@/components/ui/select";
import { Booking } from "@/types/booking";
import { getDisplayCustomer, getDisplayTime, getDisplayVehicle, getDisplayPackage, getDisplayStatus } from "@/utils/bookingDisplayHelpers";

interface BookingSelectItemProps {
  booking: Booking;
}

const BookingSelectItem = ({ booking }: BookingSelectItemProps) => {
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
};

export default BookingSelectItem;
