
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ServiceTask } from "@/lib/types";

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ServiceTask) => void;
  task?: ServiceTask;
  isEditing: boolean;
}

const TaskFormDialog = ({
  isOpen,
  onClose,
  onSave,
  task,
  isEditing
}: TaskFormDialogProps) => {
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    price: number;
    duration: number;
    included: boolean;
  }>({
    id: "",
    name: "",
    price: 0,
    duration: 15,
    included: false
  });

  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        id: task.id,
        name: task.name,
        price: task.price,
        duration: task.duration,
        included: task.included
      });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        price: 0,
        duration: 15,
        included: false
      });
    }
  }, [task, isEditing, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ServiceTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-gold/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {isEditing ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter task name"
              value={formData.name}
              onChange={handleChange}
              className="bg-black/40 border-gold/30 text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (£)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="bg-black/40 border-gold/30 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="15"
                value={formData.duration}
                onChange={handleChange}
                className="bg-black/40 border-gold/30 text-white"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="included" 
              checked={formData.included} 
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, included: checked === true }))
              }
              className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <Label htmlFor="included" className="text-sm font-normal">
              Included in package base price
            </Label>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gold/30 text-white hover:bg-gold/20"
            >
              Cancel
            </Button>
            <Button type="submit" className="gold-gradient text-black hover:shadow-gold/20">
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
