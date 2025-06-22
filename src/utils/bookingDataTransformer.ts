
import { Booking } from "@/types/booking";

interface FormData {
  yourName: string;
  postcode: string;
  phone: string;
  email: string;
  notes: string;
  jobDetails: string;
  selectedDate: Date | undefined;
  selectedTime: string;
}

export const transformFormDataToBooking = (formData: FormData): Booking => {
  const { yourName, postcode, phone, email, notes, jobDetails, selectedDate, selectedTime } = formData;
  
  console.log("=== Transforming form data to booking ===");
  console.log("Form data received:", formData);
  
  // Get saved client type
  const savedClientType = localStorage.getItem('selectedClientType') || 'private';
  console.log("Retrieved client type:", savedClientType);
  
  // Ensure we have a proper Date object
  let bookingDate: Date;
  if (selectedDate) {
    // Handle complex Date objects with _type properties by creating a new clean Date
    if (typeof selectedDate === 'object' && selectedDate.constructor.name === 'Date') {
      bookingDate = new Date(selectedDate.getTime());
    } else if (typeof selectedDate === 'string') {
      bookingDate = new Date(selectedDate);
    } else {
      bookingDate = new Date(selectedDate);
    }
  } else {
    bookingDate = new Date();
  }
  
  console.log("Processed booking date:", bookingDate);
  
  // Create a simplified booking for "Other" job types
  const newBooking: Booking = {
    id: `other-${Date.now()}`,
    customer: yourName,
    vehicle: "Other Service", // Generic vehicle for other services
    vehicleReg: "",
    jobDetails: jobDetails,
    packageType: "other", // Special package type for other services
    date: bookingDate,
    time: selectedTime || "TBD",
    location: postcode,
    contact: phone,
    email: email,
    notes: notes,
    status: "pending",
    clientType: savedClientType as "private" | "corporate",
    jobType: "other"
  };

  console.log("Created new booking:", newBooking);
  console.log("Booking date type:", typeof newBooking.date);
  console.log("Booking date value:", newBooking.date);
  
  return newBooking;
};
