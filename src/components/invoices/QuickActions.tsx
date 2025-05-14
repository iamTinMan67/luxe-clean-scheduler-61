
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileDown, Send } from "lucide-react";

const QuickActions: React.FC = () => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
          <FileText size={16} className="mr-2" />
          Create New Invoice
        </Button>
        
        <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
          <FileDown size={16} className="mr-2" />
          Export Reports
        </Button>
        
        <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
          <Send size={16} className="mr-2" />
          Send Reminders
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
