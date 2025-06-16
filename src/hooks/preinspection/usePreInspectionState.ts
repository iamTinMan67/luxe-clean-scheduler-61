
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Booking } from "@/types/booking";

export const usePreInspectionState = () => {
  const [searchParams] = useSearchParams();
  const initialBookingId = searchParams.get('bookingId') || '';
  
  const [images, setImages] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>(initialBookingId);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineNotes, setShowDeclineNotes] = useState(false);

  return {
    images,
    setImages,
    selectedBooking,
    setSelectedBooking,
    bookingDetails,
    setBookingDetails,
    exteriorNotes,
    setExteriorNotes,
    interiorNotes,
    setInteriorNotes,
    isSubmitting,
    setIsSubmitting,
    showDeclineNotes,
    setShowDeclineNotes,
    initialBookingId
  };
};
