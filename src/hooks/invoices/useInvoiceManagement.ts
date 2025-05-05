
import { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { toast } from "sonner";

export const useInvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedInvoices = JSON.parse(savedInvoices).map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date)
        }));
        setInvoices(parsedInvoices);
      } catch (error) {
        console.error('Error parsing invoices:', error);
      }
    }
  }, []);
  
  // Function to mark invoice as paid
  const markAsPaid = (invoiceId: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, paid: true } : invoice
    );
    
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast.success("Invoice marked as paid", {
      description: `Invoice #${invoiceId} has been marked as paid.`
    });
  };
  
  return {
    invoices,
    markAsPaid
  };
};
