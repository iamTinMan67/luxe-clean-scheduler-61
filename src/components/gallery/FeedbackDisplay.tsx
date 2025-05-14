
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface FeedbackDisplayProps {
  customerReview?: {
    rating: number;
    comment: string;
    date: string | Date;
    customerName?: string;
  };
}

const FeedbackDisplay = ({ customerReview }: FeedbackDisplayProps) => {
  if (!customerReview) return null;
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };
  
  return (
    <Card className="bg-black/70 backdrop-blur-sm border border-gray-800 mt-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < customerReview.rating ? "fill-gold text-gold" : "text-gray-500"}
              />
            ))}
          </div>
          <div className="text-sm text-gray-400">
            {formatDate(customerReview.date)}
          </div>
        </div>
        
        {customerReview.customerName && (
          <div className="mb-1 text-sm font-medium text-gray-200">
            {customerReview.customerName}
          </div>
        )}
        
        <p className="text-sm text-gray-300 italic">
          "{customerReview.comment}"
        </p>
      </CardContent>
    </Card>
  );
};

export default FeedbackDisplay;
