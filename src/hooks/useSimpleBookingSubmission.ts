
import { toast } from "sonner";
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

export const useSimpleBookingSubmission = () => {
  const submitBooking = async (formData: FormData, resetForm: () => void) => {
    const { yourName, postcode, phone, email, notes, jobDetails, selectedDate, selectedTime } = formData;
    
    console.log("Simple booking submission data:", formData);
    
    if (!yourName || !postcode || !phone || !email || !jobDetails) {
      toast.error("Oops! Check Again", {
        description: "Please fill in all required fields"
      });
      console.log("Validation failed - missing required fields");
      return;
    }

    try {
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

      // Save to localStorage (existing booking storage)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = [...existingBookings, newBooking];
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      console.log("Booking saved to localStorage. Total bookings:", updatedBookings.length);

      // Clear the saved client type
      localStorage.removeItem('selectedClientType');

      // Show success message
      toast.success("Request Submitted!", {
        description: "We'll contact you soon to discuss your requirements and provide a quote.",
        style: {
          background: '#f97316', // Orange background
          color: 'white',
          border: '1px solid #ea580c'
        }
      });

      // Reset form
      resetForm();

    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact us directly."
      });
    }
  };

  return { submitBooking };
};
