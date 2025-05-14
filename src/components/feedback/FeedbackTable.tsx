
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

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

interface FeedbackTableProps {
  feedback: CustomerFeedback[];
  onViewFeedback: (feedback: CustomerFeedback) => void;
}

const FeedbackTable = ({ feedback, onViewFeedback }: FeedbackTableProps) => {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Feedback</CardTitle>
        <CardDescription>
          Review and respond to customer feedback for your services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.length > 0 ? (
              feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < item.rating ? "fill-gold text-gold" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                  <TableCell>
                    {item.images && item.images.length > 0 ? (
                      <Badge variant="outline">{item.images.length} images</Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.responded ? "outline" : "default"}>
                      {item.responded ? "Responded" : "Awaiting Response"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onViewFeedback(item)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No feedback found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeedbackTable;
