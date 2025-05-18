
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InspectionChecklistProps {
  onSubmitReport: () => void;
}

const InspectionChecklist = ({ onSubmitReport }: InspectionChecklistProps) => {
  const checklistItems = [
    "Exterior body condition documented",
    "Interior condition documented",
    "Existing damage photographed",
    "Personal items noted and secured",
    "Customer signature obtained",
    "Staff signature provided"
  ];

  return (
    <Card className="bg-black/60 border-gold/30 sticky top-24">
      <CardHeader>
        <CardTitle className="text-white">Pre-Inspection Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-white/5">
              <div className="h-6 w-6 rounded-full flex items-center justify-center border border-gold/50">
                <Check size={14} className="text-gold" />
              </div>
              <span className="text-white">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Button 
            className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
            onClick={onSubmitReport}
          >
            Submit Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionChecklist;
