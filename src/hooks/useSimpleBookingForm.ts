
import { useState } from "react";
import { toast } from "sonner";
import { Booking } from "@/types/booking";

export const useSimpleBookingForm = () => {
  const [yourName, setYourName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [jobDetails, setJobDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yourName || !postcode || !phone || !email || !jobDetails) {
      toast.error("Oops! Check Again", {
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      // Create a simplified booking for "Other" job types
      const newBooking: Booking = {
        id: `other-${Date.now()}`,
        customer: yourName,
        vehicle: "Other Service", // Generic vehicle for other services
        vehicleReg: "",
        jobDetails: jobDetails,
        packageType: "other", // Special package type for other services
        date: new Date(),
        time: "TBD",
        location: postcode,
        contact: phone,
        email: email,
        notes: notes,
        status: "pending",
        clientType: "private", // Default to private
        jobType: "other"
      };

      // Save to localStorage (existing booking storage)
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedBookings = [...existingBookings, newBooking];
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      // Show success message
      toast.success("Request Submitted!", {
        description: "We'll contact you soon to discuss your requirements.",
        style: {
          background: '#f97316', // Orange background
          color: 'white',
          border: '1px solid #ea580c'
        }
      });

      // Reset form
      setYourName("");
      setPostcode("");
      setPhone("");
      setEmail("");
      setNotes("");
      setJobDetails("");

    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong", {
        description: "Please try again or contact us directly."
      });
    }
  };

  return {
    yourName,
    setYourName,
    postcode,
    setPostcode,
    phone,
    setPhone,
    email,
    setEmail,
    notes,
    setNotes,
    jobDetails,
    setJobDetails,
    handleSubmit,
  };
};
