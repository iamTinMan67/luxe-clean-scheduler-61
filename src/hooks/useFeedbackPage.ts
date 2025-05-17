
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Invoice } from "@/lib/types";

interface UseFeedbackPageReturn {
  invoice: Invoice | null;
  customerName: string;
  serviceDate: string;
  loading: boolean;
  isPaid: boolean;  // Added property
}

export function useFeedbackPage(invoiceId: string | undefined): UseFeedbackPageReturn {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);  // Added state
  
  // Load invoice data on component mount
  useEffect(() => {
    if (!invoiceId) {
      setLoading(false);
      return;
    }

    const loadInvoice = () => {
      setLoading(true);
      const savedInvoices = localStorage.getItem('invoices');
      
      if (savedInvoices) {
        try {
          const parsedInvoices = JSON.parse(savedInvoices);
          const foundInvoice = parsedInvoices.find((inv: any) => inv.id === invoiceId);
          
          if (foundInvoice) {
            setInvoice({
              ...foundInvoice,
              date: new Date(foundInvoice.date)
            });
            
            // Set the paid status
            setIsPaid(foundInvoice.paid === true);
            
            // Format service date
            const invoiceDate = new Date(foundInvoice.date);
            setServiceDate(invoiceDate.toLocaleDateString('en-GB', {
              day: 'numeric', 
              month: 'long', 
              year: 'numeric'
            }));
            
            // Load customer info from confirmed bookings
            const confirmedBookings = localStorage.getItem('confirmedBookings');
            if (confirmedBookings) {
              const parsedBookings = JSON.parse(confirmedBookings);
              const relatedBooking = parsedBookings.find((booking: any) => 
                booking.id === invoiceId
              );
              
              if (relatedBooking) {
                setCustomerName(relatedBooking.customer || "");
              }
            }
          } else {
            toast({
              title: "Invoice not found",
              description: "The requested invoice could not be found.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error parsing invoices:', error);
        }
      }
      
      setLoading(false);
    };
    
    loadInvoice();
  }, [invoiceId]);
  
  return {
    invoice,
    customerName,
    serviceDate,
    loading,
    isPaid
  };
}
