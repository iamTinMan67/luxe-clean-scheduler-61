
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import { CustomerFeedback } from "@/components/feedback/types";

interface FeedbackTabsProps {
  feedback: CustomerFeedback[];
  onViewFeedback: (feedback: CustomerFeedback) => void;
}

const FeedbackTabs = ({ feedback, onViewFeedback }: FeedbackTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter feedback based on active tab
  const filteredFeedback = activeTab === "all" 
    ? feedback 
    : activeTab === "unresponded"
      ? feedback.filter(item => !item.responded)
      : feedback.filter(item => item.responded);

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Feedback</TabsTrigger>
        <TabsTrigger value="unresponded">Awaiting Response</TabsTrigger>
        <TabsTrigger value="responded">Responded</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <FeedbackTable 
          feedback={filteredFeedback} 
          onViewFeedback={onViewFeedback} 
        />
      </TabsContent>
      
      <TabsContent value="unresponded" className="mt-0">
        <FeedbackTable 
          feedback={filteredFeedback} 
          onViewFeedback={onViewFeedback} 
        />
      </TabsContent>
      
      <TabsContent value="responded" className="mt-0">
        <FeedbackTable 
          feedback={filteredFeedback} 
          onViewFeedback={onViewFeedback} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default FeedbackTabs;
