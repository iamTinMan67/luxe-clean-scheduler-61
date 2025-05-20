
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FeedbackErrors from "@/components/feedback/form/FeedbackErrors";
import FeedbackFormComponent from "@/components/feedback/FeedbackFormComponent";

const FeedbackForm = () => {
  const [manualBookingId, setManualBookingId] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleBookingIdSubmit = () => {
    // Clear previous errors
    setError(undefined);
    
    if (!manualBookingId.trim()) {
      setError("Please enter a valid booking ID");
      toast({
        variant: "destructive",
        description: "Please enter a valid booking ID"
      });
      return;
    }

    const bookingId = manualBookingId.trim();

    // Check if booking exists in storage
    const bookingsStr = localStorage.getItem("confirmedBookings");
    if (bookingsStr) {
      const bookings = JSON.parse(bookingsStr);
      const bookingExists = bookings.some((booking: any) => booking.id === bookingId);
      
      if (!bookingExists) {
        setError("Booking ID not found in the system");
        toast({
          variant: "destructive",
          description: "Booking ID not found in the system"
        });
        return;
      }
    }

    // Check if invoice is paid
    const invoicesStr = localStorage.getItem("invoices");
    if (invoicesStr) {
      const invoices = JSON.parse(invoicesStr);
      const invoice = invoices.find((inv: any) => inv.id === bookingId);
      
      if (invoice) {
        setIsPaid(invoice.paid === true);
        
        if (!invoice.paid) {
          toast({
            description: "Note: This invoice has not been marked as paid yet. In normal operation, customers can only submit feedback for paid invoices.",
          });
        }
      } else {
        toast({
          description: "No invoice found for this booking ID. Creating a test invoice.",
        });
      }
    }

    setShowForm(true);
  };

  return (
    <div className="container py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Manual Feedback Collection</h1>
      
      {!showForm ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Booking Reference</h2>
          
          {error && <FeedbackErrors customMessage={error} />}
          
          <div className="flex gap-3">
            <Input 
              placeholder="Enter the booking ID" 
              value={manualBookingId}
              onChange={(e) => setManualBookingId(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleBookingIdSubmit}>
              Continue
            </Button>
          </div>
        </Card>
      ) : (
        <FeedbackFormComponent 
          bookingId={manualBookingId} 
          redirectPath="/admin/feedback"
          isPaid={true} // Override for admin use - always allow feedback collection
        />
      )}
    </div>
  );
};

export default FeedbackForm;
