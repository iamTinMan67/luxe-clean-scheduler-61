
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

const normalizeDate = (dateInput: Date | undefined): Date => {
  if (!dateInput) {
    console.log("No date provided, using current date");
    return new Date();
  }

  try {
    // Handle complex Date objects with _type properties
    if (typeof dateInput === 'object' && dateInput.constructor.name === 'Date') {
      // Create a clean Date object from the timestamp
      const cleanDate = new Date(dateInput.getTime());
      console.log("Normalized complex Date object:", cleanDate);
      return cleanDate;
    } else if (typeof dateInput === 'string') {
      const parsedDate = new Date(dateInput);
      console.log("Parsed string date:", parsedDate);
      return parsedDate;
    } else {
      // Fallback: try to create a new Date
      const fallbackDate = new Date(dateInput);
      console.log("Fallback date creation:", fallbackDate);
      return fallbackDate;
    }
  } catch (error) {
    console.error("Error normalizing date:", error);
    return new Date(); // Return current date as fallback
  }
};

export const transformFormDataToBooking = (formData: FormData): Booking => {
  const { yourName, postcode, phone, email, notes, jobDetails, selectedDate, selectedTime } = formData;
  
  console.log("=== Transforming form data to booking ===");
  console.log("Form data received:", formData);
  
  // Get saved client type
  const savedClientType = localStorage.getItem('selectedClientType') || 'private';
  console.log("Retrieved client type:", savedClientType);
  
  // Normalize the date properly
  const bookingDate = normalizeDate(selectedDate);
  console.log("Processed booking date:", bookingDate);
  console.log("Booking date type:", typeof bookingDate);
  console.log("Booking date ISO string:", bookingDate.toISOString());
  
  // Create a simplified booking for "Other" job types
  const newBooking: Booking = {
    id: `other-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  console.log("Final booking date verification:", {
    type: typeof newBooking.date,
    value: newBooking.date,
    isValidDate: newBooking.date instanceof Date && !isNaN(newBooking.date.getTime())
  });
  
  return newBooking;
};
