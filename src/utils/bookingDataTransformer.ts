
import { Booking, validateBookingStatus } from '@/types/booking';

export interface SupabaseBookingData {
  id: string;
  customer_name: string;
  vehicle_type: string;
  notes: string;
  package_type: string;
  date: string;
  time: string;
  start_time?: string;
  end_time?: string;
  location: string;
  customer_phone?: string;
  customer_email?: string;
  status: string;
  condition?: number;
  staff?: any[];
  created_at?: string;
  total_price?: number;
}

export const transformSupabaseBooking = (booking: SupabaseBookingData): Booking => {
  // Safely convert staff JSONB to string array
  let staff: string[] = [];
  if (Array.isArray(booking.staff)) {
    staff = booking.staff.filter((item): item is string => typeof item === 'string');
  }

  const transformedBooking: Booking = {
    id: booking.id,
    customer: booking.customer_name,
    vehicle: booking.vehicle_type,
    vehicleReg: '',
    jobDetails: booking.notes,
    secondVehicle: '',
    secondVehicleReg: '',
    packageType: booking.package_type,
    date: new Date(booking.date + 'T' + (booking.time || '09:00')),
    time: booking.time,
    startTime: booking.start_time,
    endTime: booking.end_time,
    location: booking.location,
    contact: booking.customer_phone,
    email: booking.customer_email,
    notes: booking.notes,
    status: validateBookingStatus(booking.status),
    condition: booking.condition || 5,
    staff: staff,
    createdAt: booking.created_at,
    totalPrice: booking.total_price,
    travelMinutes: 0,
    additionalServices: [],
    clientType: "private",
    vehicleType: booking.vehicle_type
  };

  return transformedBooking;
};

export const logTransformedBooking = (booking: Booking) => {
  const bookingDate = booking.date instanceof Date ? booking.date : new Date(booking.date);
  
  console.log("Transformed booking:", {
    id: booking.id,
    customer: booking.customer,
    status: booking.status,
    date: booking.date,
    dateString: bookingDate.toDateString()
  });
};
