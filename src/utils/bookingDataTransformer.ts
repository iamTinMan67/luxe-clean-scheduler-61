
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
  
  // Get saved client type
  const savedClientType = localStorage.getItem('selectedClientType') || 'private';
  console.log("Retrieved client type:", savedClientType);
  
  // Create a simplified booking for "Other" job types
  const newBooking: Booking = {
    id: `other-${Date.now()}`,
    customer: yourName,
    vehicle: "Other Service", // Generic vehicle for other services
    vehicleReg: "",
    jobDetails: jobDetails,
    packageType: "other", // Special package type for other services
    date: selectedDate || new Date(),
    time: selectedTime || "TBD",
    location: postcode,
    contact: phone,
    email: email,
    notes: notes,
    status: "pending",
    clientType: savedClientType as "private" | "corporate",
    jobType: "other"
  };

  console.log("Creating new booking:", newBooking);
  return newBooking;
};
