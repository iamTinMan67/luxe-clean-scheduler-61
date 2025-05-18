
import { useState, useEffect } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InspectionChecklistItem, CustomChecklistItem } from "@/types/task";
import { getChecklistItemsForVehicle } from "@/data/inspectionChecklist";

interface InspectionChecklistProps {
  onSubmitReport: () => void;
  vehicleType?: string;
  isSubmitting?: boolean;
}

const InspectionChecklist = ({ 
  onSubmitReport, 
  vehicleType = "car", 
  isSubmitting = false 
}: InspectionChecklistProps) => {
  const { toast } = useToast();
  const [checklistItems, setChecklistItems] = useState<InspectionChecklistItem[]>([]);
  const [customItems, setCustomItems] = useState<CustomChecklistItem[]>([]);
  const [newCustomItem, setNewCustomItem] = useState("");
  
  // Load default checklist items based on vehicle type
  useEffect(() => {
    if (vehicleType) {
      const items = getChecklistItemsForVehicle(vehicleType);
      setChecklistItems(items);
    }
  }, [vehicleType]);

  const toggleChecklistItem = (id: number) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const toggleCustomItem = (id: string) => {
    setCustomItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const addCustomItem = () => {
    if (newCustomItem.trim() === "") return;
    
    const newItem: CustomChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newCustomItem,
      completed: false
    };
    
    setCustomItems([...customItems, newItem]);
    setNewCustomItem("");
  };
  
  const removeCustomItem = (id: string) => {
    setCustomItems(items => items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    // Check if minimum required items are completed
    const requiredItems = checklistItems.filter(item => item.required);
    const missingItems = requiredItems.filter(item => !item.completed);
    
    if (missingItems.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing checklist items",
        description: "Please complete all required inspection items before submitting."
      });
      return;
    }
    
    // Save inspection data
    const inspectionData = {
      standardItems: checklistItems,
      customItems: customItems
    };
    
    // Save to localStorage for now (will be used by the submitPreInspectionReport function)
    localStorage.setItem('lastInspectionChecklist', JSON.stringify(inspectionData));
    
    onSubmitReport();
  };

  return (
    <Card className="bg-black/60 border-gold/30 sticky top-24">
      <CardHeader>
        <CardTitle className="text-white">Pre-Inspection Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Standard checklist items based on vehicle type */}
          <div className="mb-4">
            <h3 className="text-white text-sm font-medium mb-2">Standard Checklist</h3>
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
                  {!item.required && (
                    <span className="text-xs text-gray-400">
                      (Optional)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom checklist items */}
          <div>
            <h3 className="text-white text-sm font-medium mb-2">Custom Checklist Items</h3>
            
            {/* Add custom item input */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newCustomItem}
                onChange={(e) => setNewCustomItem(e.target.value)}
                placeholder="Add custom inspection item"
                className="bg-black/40 border-gold/30 text-white"
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
              />
              <Button 
                onClick={addCustomItem}
                className="gold-gradient text-black flex items-center"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Custom items list */}
            {customItems.length > 0 ? (
              customItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 p-2 rounded hover:bg-white/5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleCustomItem(item.id)}
                      className="mt-0.5"
                    />
                    <span className={`text-white ${item.completed ? 'line-through opacity-70' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomItem(item.id)}
                    className="text-red-500 hover:text-red-300 hover:bg-red-500/10 p-1 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No custom items added</p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionChecklist;
