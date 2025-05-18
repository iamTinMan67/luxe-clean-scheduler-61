
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface InspectionChecklistProps {
  onSubmitReport: () => void;
}

const InspectionChecklist = ({ onSubmitReport }: InspectionChecklistProps) => {
  const { toast } = useToast();
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: "Exterior body condition documented", completed: false },
    { id: 2, label: "Interior condition documented", completed: false },
    { id: 3, label: "Existing damage photographed", completed: false },
    { id: 4, label: "Personal items noted and secured", completed: false },
    { id: 5, label: "Customer signature obtained", completed: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleSubmit = () => {
    // Check if minimum required items are completed
    const requiredItems = checklistItems.filter(item => 
      // Customer signature is not strictly required
      item.id !== 5
    );
    
    const missingItems = requiredItems.filter(item => !item.completed);
    
    if (missingItems.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing checklist items",
        description: "Please complete all required inspection items before submitting."
      });
      return;
    }
    
    onSubmitReport();
  };

  return (
    <Card className="bg-black/60 border-gold/30 sticky top-24">
      <CardHeader>
        <CardTitle className="text-white">Pre-Inspection Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-2 rounded hover:bg-white/5">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleChecklistItem(item.id)}
                className="mt-0.5"
              />
              <div className="flex flex-col">
                <span className={`text-white ${item.completed ? 'line-through opacity-70' : ''}`}>
                  {item.label}
                </span>
                {item.id === 5 && (
                  <span className="text-xs text-gray-400">
                    (Optional - check only if customer signed)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Button 
            className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
            onClick={handleSubmit}
          >
            Submit Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionChecklist;
