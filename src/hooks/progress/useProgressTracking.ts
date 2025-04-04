import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";

interface BookingStep {
  id: number;
  name: string;
  completed: boolean;
  time?: string;
  estimatedTime?: string;
}

interface ProgressBooking {
  id: string;
  customerName: string;
  vehicleType: string;
  packageType: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "confirmed" | "in-progress" | "completed";
  progressPercentage: number;
  totalPrice: number;
  steps: BookingStep[];
}

export const useProgressTracking = (invoiceIdFromUrl: string | null) => {
  // State for booking data
  const [booking, setBooking] = useState<ProgressBooking>({
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
  });
  
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
  
  // Calculate the current active step
  const currentStepIndex = booking.steps.findIndex(step => !step.completed);
  const currentStep = currentStepIndex !== -1 ? booking.steps[currentStepIndex] : null;
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to send text report to customer
  const sendTextReport = () => {
    // In a real app, this would use an SMS API service
    console.log("Sending text report to customer:", booking.customerName);
    toast.success("Text report sent to customer", {
      description: `A completion report has been sent to ${booking.customerName}`
    });
  };
  
  // Function to send completion and feedback request
  const sendCompletionSMS = () => {
    // This would be implemented with a real SMS service
    console.log(`Sending completion SMS to ${booking.customerName}`);
    
    // Generate feedback URL with the invoice ID
    const feedbackUrl = `/feedback/${booking.id}`;
    
    toast.success("Thank you message sent", {
      description: `A thank you message with feedback request has been sent to ${booking.customerName}`
    });
  };
  
  // Function to generate an invoice for the completed booking
  const generateInvoice = () => {
    // Check if an invoice already exists for this booking
    const existingInvoices = localStorage.getItem('invoices') 
      ? JSON.parse(localStorage.getItem('invoices') || '[]') 
      : [];
    
    const existingInvoice = existingInvoices.find((inv: any) => inv.id === booking.id);
    if (existingInvoice) {
      console.log("Invoice already exists for this booking:", existingInvoice.id);
      return existingInvoice;
    }
    
    // Calculate subtotal, tax, and total
    const subtotal = booking.totalPrice;
    const tax = subtotal * 0.2; // 20% VAT
    const total = subtotal + tax;
    
    // Create invoice items based on package type
    const items = [
      {
        description: `${booking.packageType} Package for ${booking.vehicleType}`,
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal
      }
    ];
    
    // Create the invoice object using booking ID
    const invoice: Invoice = {
      id: booking.id, // Use booking ID as invoice ID
      bookingId: booking.id,
      customerId: booking.id, // Using booking ID as customer ID for simplicity
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
      paid: false,
      date: new Date()
    };
    
    // Save invoice to localStorage
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));
    
    console.log("Generated invoice:", invoice);
    toast.success("Invoice generated", {
      description: `Invoice for booking #${invoice.id} has been created for ${booking.customerName}`
    });
    
    return invoice;
  };
  
  // Function to update planner calendar status
  const updatePlannerCalendar = () => {
    // Get bookings from localStorage
    const pendingBookingsStr = localStorage.getItem('pendingBookings');
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    
    try {
      // Update pending bookings if they exist
      if (pendingBookingsStr) {
        const pendingBookings = JSON.parse(pendingBookingsStr);
        // Find the current booking in pendingBookings by ID and update its status
        const updatedPendingBookings = pendingBookings.filter((b: any) => b.id !== booking.id);
        localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
      }
      
      // Update confirmed bookings if they exist
      if (confirmedBookingsStr) {
        const confirmedBookings = JSON.parse(confirmedBookingsStr);
        // Find the current booking in confirmedBookings by ID and update its status or add it
        const existingIndex = confirmedBookings.findIndex((b: any) => b.id === booking.id);
        
        if (existingIndex >= 0) {
          // Update existing booking
          confirmedBookings[existingIndex] = { 
            ...confirmedBookings[existingIndex], 
            status: "completed",
            totalPrice: booking.totalPrice
          };
        } else {
          // Add new completed booking
          confirmedBookings.push({
            id: booking.id,
            customer: booking.customerName,
            vehicle: booking.vehicleType,
            packageType: booking.packageType,
            date: new Date(booking.date),
            time: booking.time,
            startTime: booking.time,
            endTime: `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}`,
            location: booking.location,
            status: "completed",
            totalPrice: booking.totalPrice
          });
        }
        
        localStorage.setItem('confirmedBookings', JSON.stringify(confirmedBookings));
      } else {
        // Create confirmedBookings if it doesn't exist
        const newCompletedBooking = {
          id: booking.id,
          customer: booking.customerName,
          vehicle: booking.vehicleType,
          packageType: booking.packageType,
          date: new Date(booking.date),
          time: booking.time,
          startTime: booking.time,
          endTime: `${parseInt(booking.time.split(':')[0]) + 2}:${booking.time.split(':')[1]}`,
          location: booking.location,
          status: "completed",
          totalPrice: booking.totalPrice
        };
        localStorage.setItem('confirmedBookings', JSON.stringify([newCompletedBooking]));
      }
      
      console.log("Updated booking status in planner calendar:", booking.id);
    } catch (error) {
      console.error("Error updating planner calendar:", error);
    }
  };
  
  // In a real app, you would fetch the booking status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress updates
      setBooking(prev => {
        // Don't increase beyond 100%
        if (prev.progressPercentage >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            status: "completed",
            progressPercentage: 100,
            steps: prev.steps.map(step => ({ ...step, completed: true }))
          };
        }
        
        // Calculate which step should be completed based on progress
        const newProgressPercentage = Math.min(prev.progressPercentage + 2, 100);
        const stepsToComplete = Math.floor((newProgressPercentage / 100) * prev.steps.length);
        
        return {
          ...prev,
          progressPercentage: newProgressPercentage,
          status: newProgressPercentage === 100 ? "completed" : "in-progress",
          steps: prev.steps.map((step, index) => ({
            ...step,
            completed: index < stepsToComplete
          }))
        };
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Add effect to handle completion
  useEffect(() => {
    // When service is completed (100%), send text, update calendar, and generate invoice
    if (booking.status === "completed" && booking.progressPercentage === 100) {
      sendTextReport();
      updatePlannerCalendar();
      generateInvoice();
      sendCompletionSMS(); // Send the completion SMS with feedback request
    }
  }, [booking.status, booking.progressPercentage]);
  
  return {
    booking,
    currentStep,
    currentStepIndex,
    formatDate
  };
};
