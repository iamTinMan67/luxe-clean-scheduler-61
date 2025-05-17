
import FeedbackFormComponent from "@/components/feedback/FeedbackFormComponent";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FeedbackForm = () => {
  const [manualBookingId, setManualBookingId] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleBookingIdSubmit = () => {
    if (!manualBookingId.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a valid booking ID"
      });
      return;
    }

    // Check if booking exists in storage
    const bookingsStr = localStorage.getItem("confirmedBookings");
    if (bookingsStr) {
      const bookings = JSON.parse(bookingsStr);
      const bookingExists = bookings.some((booking: any) => booking.id === manualBookingId.trim());
      
      if (!bookingExists) {
        toast({
          variant: "destructive",
          description: "Booking ID not found in the system"
        });
        return;
      }
    }

    setShowForm(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Manual Feedback Collection</h1>
      
      {!showForm ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Booking Reference</h2>
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
        />
      )}
    </div>
  );
};

export default FeedbackForm;
