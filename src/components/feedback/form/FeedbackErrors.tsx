
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type FeedbackErrorType = 
  | "already-submitted" 
  | "unpaid-invoice" 
  | "missing-rating" 
  | "missing-booking-id" 
  | "submission-error"
  | "general-error";

interface FeedbackErrorProps {
  errorType?: FeedbackErrorType;
  customMessage?: string;
}

const FeedbackErrors: React.FC<FeedbackErrorProps> = ({ 
  errorType,
  customMessage 
}) => {
  if (!errorType && !customMessage) return null;
  
  let errorMessage: string;
  
  switch (errorType) {
    case "already-submitted":
      errorMessage = "You have already submitted feedback for this booking.";
      break;
    case "unpaid-invoice":
      errorMessage = "Feedback can only be submitted for paid bookings.";
      break;
    case "missing-rating":
      errorMessage = "Please select a rating before submitting your feedback.";
      break;
    case "missing-booking-id":
      errorMessage = "Error: Missing booking reference.";
      break;
    case "submission-error":
      errorMessage = "There was a problem submitting your feedback. Please try again.";
      break;
    case "general-error":
      errorMessage = "An error occurred. Please try again later.";
      break;
    default:
      errorMessage = customMessage || "An unexpected error occurred.";
  }

  return (
    <Alert variant="destructive" className="mb-4 border-red-500/50 bg-red-500/10">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};

export default FeedbackErrors;
