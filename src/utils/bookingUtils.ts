
// Make sure this file doesn't already exist, since we're recreating it
import { Booking } from "@/types/booking";
import { toast } from "sonner";

// Generate invoice
export const generateInvoice = (booking: Booking) => {
  // Calculate subtotal, tax, and total
  const subtotal = booking.totalPrice || 0;
  // const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal;
  //+ tax;
  
  // Create invoice items based on package type
  const items = [
    {
      description: `${booking.packageType} Package for ${booking.vehicle}`,
      quantity: 1,
      unitPrice: subtotal,
      total: subtotal
    }
  ];
  
  // Create the invoice object using the booking.id as the invoice ID
  const invoice = {
    id: booking.id, // Use booking ID as invoice ID
    bookingId: booking.id,
    customerId: booking.id,
    items: items,
    subtotal: subtotal,
    total: total,
    paid: false,
    date: new Date()
  };
  
  // Save invoice to localStorage
  const existingInvoices = localStorage.getItem('invoices') 
    ? JSON.parse(localStorage.getItem('invoices') || '[]') 
    : [];
  
  // Check if an invoice with this ID already exists
  const invoiceExists = existingInvoices.some((inv: any) => inv.id === booking.id);
  
  if (!invoiceExists) {
    localStorage.setItem('invoices', JSON.stringify([...existingInvoices, invoice]));
    
    // Send invoice notification
    sendNotification(booking, "invoice");
  }
  
  return invoice;
};

// Send SMS notification
export const sendNotification = (booking: Booking, type: "invoice" | "update" | "completion") => {
  // In a real app, this would connect to SMS API
  let message = "";
  
  switch (type) {
    case "invoice":
      message = `New invoice generated for ${booking.customer}`;
      break;
    case "update":
      message = `Booking updated for ${booking.customer}`;
      break;
    case "completion":
      message = `Thank you for your business, ${booking.customer}! Your valet service is complete. Feedback would be GREATLY appreciated. Being as you are our last customer your comments will be shown on the website: ${window.location.origin}/feedback/${booking.id}`;
      break;
  }
  
  console.log("SMS Notification:", message);
  
  toast.success(`Notification sent`, {
    description: message,
  });
};
