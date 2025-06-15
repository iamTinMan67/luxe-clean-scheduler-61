
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormData {
  yourName: string;
  postcode: string;
  phone: string;
  email: string;
  notes: string;
  jobDetails: string;
}

interface UseBookingFormProps {
  onSubmit: (formData: BookingFormData) => void;
}

export const useBookingForm = ({ onSubmit }: UseBookingFormProps) => {
  const [yourName, setYourName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [jobDetails, setJobDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yourName || !postcode || !phone || !email) {
      toast.error("Oops! Check Again", {
        description: "Please fill in all required fields"
      });
      return;
    }
    
    // Save booking to Supabase as well as calling the original onSubmit
    try {
      const bookingData = {
        customer_name: yourName,
        customer_email: email,
        customer_phone: phone,
        location: postcode,
        notes: `${notes} ${jobDetails}`.trim(),
        status: 'pending',
        // Default values for required fields
        vehicle_type: 'car',
        package_type: 'basic',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        total_price: 0
      };

      const { error } = await supabase
        .from("bookings")
        .insert(bookingData);

      if (error) {
        console.error("Error saving booking to database:", error);
        // Continue with original flow even if database save fails
      }
    } catch (error) {
      console.error("Error with booking submission:", error);
      // Continue with original flow
    }
    
    onSubmit({
      yourName,
      postcode,
      phone,
      email,
      notes,
      jobDetails,
    });
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
