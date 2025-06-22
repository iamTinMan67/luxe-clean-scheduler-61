
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
  
  // Create the invoice object using the booking.id (which now uses the new format)
  const invoice = {
    id: booking.id, // This now uses the new ID format (PC/PV/PO/CC/CV/CO + timestamp)
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
  
  // For completion messages, check if the invoice is paid before sending feedback request
  if (type === "completion") {
    // Check invoice payment status
    const invoicesStr = localStorage.getItem('invoices');
    const isPaid = invoicesStr ? JSON.parse(invoicesStr).some(
      (inv: any) => inv.id === booking.id && inv.paid === true
    ) : false;
    
    if (isPaid) {
      message = `Thank you for your business, ${booking.customer}! Your valet service is complete. Feedback would be GREATLY appreciated. Being as you are our last customer your comments will be shown on the website: ${window.location.origin}/feedback/${booking.id}`;
    } else {
      message = `Thank you for your business, ${booking.customer}! Your valet service is complete. Once payment is processed, you'll be able to provide feedback on our service.`;
    }
  } else if (type === "invoice") {
    message = `New invoice generated for ${booking.customer} (Booking ID: ${booking.id})`;
  } else if (type === "update") {
    message = `Booking updated for ${booking.customer} (Booking ID: ${booking.id})`;
  }
  
  console.log("SMS Notification:", message);
  
  toast.success(`Notification sent`, {
    description: message,
  });
};
