
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// Mock data - in a real app, this would come from Supabase
const mockFeedback = [
  {
    id: "1",
    bookingId: "b001",
    customerName: "John Smith",
    date: "2025-05-10",
    rating: 5,
    comment: "Excellent service! My car looks brand new.",
    responded: true,
  },
  {
    id: "2",
    bookingId: "b002",
    customerName: "Emily Johnson",
    date: "2025-05-11",
    rating: 4,
    comment: "Great job, very thorough cleaning.",
    responded: false,
  },
  {
    id: "3",
    bookingId: "b003",
    customerName: "Michael Brown",
    date: "2025-05-12",
    rating: 3,
    comment: "Good service but could improve on interior detailing.",
    responded: false,
  },
];

const FeedbackManager = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter feedback based on active tab
  const filteredFeedback = activeTab === "all" 
    ? mockFeedback 
    : activeTab === "unresponded"
      ? mockFeedback.filter(item => !item.responded)
      : mockFeedback.filter(item => item.responded);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Feedback Manager</h1>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="unresponded">Awaiting Response</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <FeedbackTable feedback={filteredFeedback} />
        </TabsContent>
        
        <TabsContent value="unresponded" className="mt-0">
          <FeedbackTable feedback={filteredFeedback} />
        </TabsContent>
        
        <TabsContent value="responded" className="mt-0">
          <FeedbackTable feedback={filteredFeedback} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FeedbackTable = ({ feedback }: { feedback: typeof mockFeedback }) => {
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
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
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
                  <Badge variant={item.responded ? "outline" : "default"}>
                    {item.responded ? "Responded" : "Awaiting Response"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    {!item.responded && (
                      <Button size="sm">Respond</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FeedbackManager;
