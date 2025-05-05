
import { useState } from "react";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";
import { ProgressBooking } from "./types";

export const useInvoiceGeneration = () => {
  // Function to generate an invoice for the completed booking
  const generateInvoice = (booking: ProgressBooking) => {
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

  return {
    generateInvoice
  };
};
