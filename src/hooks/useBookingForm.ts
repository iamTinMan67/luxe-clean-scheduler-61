
import { useState } from "react";
import { toast } from "sonner";

interface BookingFormData {
  yourName: string;
  postcode: string;
  phone: string;
  email: string;
  notes: string;
  vehicleReg: string;
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
  const [vehicleReg, setVehicleReg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!yourName || !postcode || !phone || !email) {
      toast.error("Oops! Check Again");
      return;
    }
    
    onSubmit({
      yourName,
      postcode,
      phone,
      email,
      notes,
      vehicleReg,
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
    vehicleReg,
    setVehicleReg,
    handleSubmit,
  };
};
