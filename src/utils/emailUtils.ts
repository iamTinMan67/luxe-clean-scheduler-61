
import { toast } from "sonner";
import { Booking } from "@/types/booking";

interface EmailTemplate {
  subject: string;
  body: string;
}

// Function to generate a tracking link for a booking
export const generateTrackingLink = (bookingId: string): string => {
  // For production, this would use the actual domain
  const baseUrl = window.location.origin;
  return `${baseUrl}/track`;
};

// Function to generate email templates for different purposes
export const generateEmailTemplate = (
  booking: Booking, 
  type: "confirmation" | "update" | "tracking"
): EmailTemplate => {
  // Get the tracking link
  const trackingLink = generateTrackingLink(booking.id);
  const trackingReference = booking.id;
  
  switch(type) {
    case "confirmation":
      return {
        subject: `Your Booking is Confirmed - ${booking.id}`,
        body: `
          Hi ${booking.customer},

          Thank you for booking with us. Your booking has been confirmed.
          
          Booking Details:
          - Reference: ${booking.id}
          - Vehicle: ${booking.vehicle}
          - Package: ${booking.packageType}
          - Date: ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}
          - Time: ${booking.time}
          - Location: ${booking.location}
          
          Track your valet service:
          1. Visit: ${trackingLink}
          2. Enter your booking reference: ${trackingReference}
          
          We look forward to serving you!
          
          The Luxe Clean Team
        `
      };
    
    case "update":
      return {
        subject: `Your Booking has been Updated - ${booking.id}`,
        body: `
          Hi ${booking.customer},

          Your booking has been updated.
          
          Booking Details:
          - Reference: ${booking.id}
          - Vehicle: ${booking.vehicle}
          - Package: ${booking.packageType}
          - Date: ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}
          - Time: ${booking.time}
          - Location: ${booking.location}
          
          Track your valet service:
          1. Visit: ${trackingLink}
          2. Enter your booking reference: ${trackingReference}
          
          If you have any questions, please contact us.
          
          The Luxe Clean Team
        `
      };
      
    case "tracking":
      return {
        subject: `Track Your Valet Service - ${booking.id}`,
        body: `
          Hi ${booking.customer},

          You can now track the progress of your valet service.
          
          Booking Details:
          - Reference: ${booking.id}
          - Vehicle: ${booking.vehicle}
          - Package: ${booking.packageType}
          - Date: ${booking.date instanceof Date ? booking.date.toLocaleDateString() : booking.date}
          - Time: ${booking.time}
          
          Track your valet service:
          1. Visit: ${trackingLink}
          2. Enter your booking reference: ${trackingReference}
          
          Thank you for choosing our service.
          
          The Luxe Clean Team
        `
      };
  }
};

// Function to send email (mock implementation)
export const sendEmail = (to: string, template: EmailTemplate) => {
  // In a real app, this would connect to an email service API
  console.log("Sending email to:", to);
  console.log("Subject:", template.subject);
  console.log("Body:", template.body);
  
  // For demo purposes, we'll just show a toast
  toast.success(`Email sent to ${to}`, {
    description: `Subject: ${template.subject}`
  });
  
  // Return a promise to simulate async behavior
  return Promise.resolve({
    success: true,
    messageId: `mock-${Date.now()}`
  });
};

// Function to send tracking information
export const sendTrackingInfo = (booking: Booking) => {
  // Check if booking has an email
  if (!booking.email) {
    toast.error("Cannot send tracking info", {
      description: "No email address available for this booking."
    });
    return Promise.reject("No email address available");
  }
  
  // Generate the email template
  const template = generateEmailTemplate(booking, "tracking");
  
  // Send the email
  return sendEmail(booking.email, template);
};
