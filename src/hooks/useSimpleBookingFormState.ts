
import { useState } from "react";

export const useSimpleBookingFormState = () => {
  const [yourName, setYourName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");

  const resetForm = () => {
    setYourName("");
    setPostcode("");
    setPhone("");
    setEmail("");
    setNotes("");
    setJobDetails("");
    setSelectedDate(undefined);
    setSelectedTime("");
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
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    resetForm,
  };
};
