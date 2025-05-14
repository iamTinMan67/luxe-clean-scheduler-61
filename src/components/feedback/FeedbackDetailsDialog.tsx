
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { format } from "date-fns";

// Define feedback interface (imported from useFeedbackManager but duplicated here for component independence)
interface CustomerFeedback {
  id: string;
  bookingId: string;
  customerName: string;
  name: string;
  email?: string;
  date: string;
  rating: number;
  comment: string;
  responded: boolean;
  images?: string[];
}

interface FeedbackDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: CustomerFeedback | null;
  onMarkAsResponded: (feedbackId: string) => void;
}

const FeedbackDetailsDialog = ({
  open,
  onOpenChange,
  feedback,
  onMarkAsResponded,
}: FeedbackDetailsDialogProps) => {
  // Get formatted date
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customer Feedback</DialogTitle>
          <DialogDescription>
            Details of the feedback submitted by {feedback.customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {getFormattedDate(feedback.date)}
              </p>
              <h3 className="text-lg font-semibold">{feedback.customerName}</h3>
              {feedback.email && (
                <p className="text-sm">{feedback.email}</p>
              )}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < feedback.rating ? "fill-gold text-gold" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Comment:</h4>
            <p className="text-sm border rounded-md p-3 bg-muted/50">{feedback.comment}</p>
          </div>
          
          {feedback.images && feedback.images.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Images:</h4>
              <div className="grid grid-cols-2 gap-2">
                {feedback.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Feedback image ${index + 1}`}
                    className="rounded-md w-full h-32 object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {!feedback.responded && (
              <Button onClick={() => onMarkAsResponded(feedback.id)}>
                Mark as Responded
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsDialog;
