
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const Feedback = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  
  // Load invoice data on component mount
  useEffect(() => {
    const loadInvoice = () => {
      const savedInvoices = localStorage.getItem('invoices');
      if (savedInvoices && invoiceId) {
        try {
          const parsedInvoices = JSON.parse(savedInvoices);
          const foundInvoice = parsedInvoices.find((inv: any) => inv.id === invoiceId);
          
          if (foundInvoice) {
            setInvoice({
              ...foundInvoice,
              date: new Date(foundInvoice.date)
            });
            
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
            toast.error("Invoice not found", {
              description: "The requested invoice could not be found."
            });
          }
        } catch (error) {
          console.error('Error parsing invoices:', error);
        }
      }
    };
    
    loadInvoice();
  }, [invoiceId]);
  
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Your <span className="text-gold">Feedback</span>
            </h1>
            <p className="text-xl text-gray-300">
              We value your opinion on our services
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {invoiceId ? (
                <FeedbackForm 
                  bookingId={invoiceId}
                  customerName={customerName}
                  serviceDate={serviceDate}
                />
              ) : (
                <div className="text-center py-8 text-white">
                  <p>No booking reference found. Please use the link provided in your invoice.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
