import { useState, useEffect } from "react";
import { ProgressBooking } from "./types";

const DEFAULT_BOOKING: ProgressBooking = {
  id: "BK-12345",
  customerName: "John Doe",
  vehicleType: "Porsche 911",
  packageType: "Elite",
  date: "2023-09-15",
  time: "10:00",
  location: "Customer's Address",
  status: "in-progress",
  progressPercentage: 65,
  totalPrice: 299,
  steps: [
    { id: 1, name: "Booking Confirmed", completed: true, time: "2023-09-10 14:30" },
    { id: 2, name: "Pre-inspection Completed", completed: true, time: "2023-09-15 10:00" },
    { id: 3, name: "Wash & Decontamination", completed: true, time: "2023-09-15 10:30" },
    { id: 4, name: "Paint Correction", completed: true, time: "2023-09-15 11:45" },
    { id: 5, name: "Ceramic Coating Application", completed: false, estimatedTime: "45 minutes" },
    { id: 6, name: "Interior Detailing", completed: false, estimatedTime: "60 minutes" },
    { id: 7, name: "Final Inspection", completed: false, estimatedTime: "15 minutes" },
    { id: 8, name: "Customer Review", completed: false, estimatedTime: "10 minutes" }
  ]
};

export const useBookingData = (invoiceIdFromUrl: string | null) => {
  // State for booking data
  const [booking, setBooking] = useState<ProgressBooking>(DEFAULT_BOOKING);
  
  // Load booking data based on invoice ID if available
  useEffect(() => {
    if (invoiceIdFromUrl) {
      // Try to find the invoice
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices) {
        try {
          const parsedInvoices = JSON.parse(savedInvoices);
          const invoice = parsedInvoices.find((inv: any) => inv.id === invoiceIdFromUrl);
          
          if (invoice) {
            // Once we have the invoice, look up the booking
            const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
            if (confirmedBookingsStr) {
              const confirmedBookings = JSON.parse(confirmedBookingsStr);
              const relatedBooking = confirmedBookings.find((b: any) => b.id === invoice.bookingId);
              
              if (relatedBooking) {
                // Update the booking state with the found booking data
                setBooking({
                  ...booking,
                  id: relatedBooking.id,
                  customerName: relatedBooking.customer,
                  vehicleType: relatedBooking.vehicle,
                  packageType: relatedBooking.packageType,
                  date: relatedBooking.date,
                  time: relatedBooking.time,
                  location: relatedBooking.location,
                  status: relatedBooking.status || "in-progress",
                  totalPrice: relatedBooking.totalPrice || booking.totalPrice,
                  // Keep the existing steps as they're not stored in the booking
                });
              }
            }
          }
        } catch (error) {
          console.error('Error loading data for invoice:', error);
        }
      }
    }
  }, [invoiceIdFromUrl]);

  return {
    booking,
    setBooking
  };
};
