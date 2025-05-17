
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSkeleton from "./form/LoadingSkeleton";
import ThankYouMessage from "./form/ThankYouMessage";
import FeedbackFormFields, { FeedbackFormData } from "./form/FeedbackFormFields";
import FeedbackErrors from "./form/FeedbackErrors";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Card } from "@/components/ui/card";

export interface FeedbackFormProps {
  bookingId: string;
  customerName?: string;
  serviceDate?: string;
  redirectPath?: string;
  isPaid?: boolean;
}

const FeedbackFormComponent = ({ 
  bookingId, 
  customerName = "", 
  serviceDate,
  redirectPath = "/",
  isPaid = false
}: FeedbackFormProps) => {
  const navigate = useNavigate();
  
  const {
    isSubmitted,
    loading,
    uploadedImages,
    setUploadedImages,
    error,
    checkExistingFeedback,
    submitFeedback
  } = useFeedbackForm({
    bookingId,
    isPaid,
    redirectPath,
    onSuccess: () => {
      // Redirect after successful submission
      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    }
  });

  // Check if feedback already exists for this booking
  useEffect(() => {
    checkExistingFeedback();
  }, [bookingId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (isSubmitted) {
    return <ThankYouMessage redirectPath={redirectPath} />;
  }

  const onSubmit = (data: FeedbackFormData) => {
    submitFeedback(data);
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      {error && <FeedbackErrors errorType={error} />}
      
      <FeedbackFormFields
        initialValues={{
          name: customerName,
          email: "",
        }}
        onSubmit={onSubmit}
        serviceDate={serviceDate}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
    </Card>
  );
};

export default FeedbackFormComponent;
