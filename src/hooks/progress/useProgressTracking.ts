
import { useState, useEffect } from "react";
import { useBookingData } from "./useBookingData";
import { useInvoiceGeneration } from "./useInvoiceGeneration";
import { useCustomerNotifications } from "./useCustomerNotifications";
import { usePlannerCalendarUpdates } from "./usePlannerCalendarUpdates";

export const useProgressTracking = (invoiceIdFromUrl: string | null) => {
  const { booking, setBooking } = useBookingData(invoiceIdFromUrl);
  const { generateInvoice } = useInvoiceGeneration();
  const { sendTextReport, sendCompletionSMS } = useCustomerNotifications();
  const { updatePlannerCalendar } = usePlannerCalendarUpdates();
  
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
      sendTextReport(booking);
      updatePlannerCalendar(booking);
      generateInvoice(booking);
      sendCompletionSMS(booking); // Send the completion SMS with feedback request
    }
  }, [booking.status, booking.progressPercentage]);
  
  return {
    booking,
    currentStep,
    currentStepIndex,
    formatDate
  };
};
