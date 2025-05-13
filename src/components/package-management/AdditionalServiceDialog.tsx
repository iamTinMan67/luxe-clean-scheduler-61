
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdditionalService } from "@/lib/types";

interface AdditionalServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: AdditionalService) => void;
  service?: AdditionalService | null;
  isEditing: boolean;
}

export const AdditionalServiceDialog = ({
  isOpen,
  onClose,
  onSave,
  service,
  isEditing
}: AdditionalServiceDialogProps) => {
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
    duration: number;
  }>({
    id: "",
    name: "",
    price: 0,
    description: "",
    duration: 30
  });

  useEffect(() => {
    if (service && isEditing) {
      setFormData({
        id: service.id,
        name: service.name,
        price: service.price,
        description: service.description,
        duration: service.duration || 30
      });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        price: 0,
        description: "",
        duration: 30
      });
    }
  }, [service, isEditing, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as AdditionalService);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-gold/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {isEditing ? "Edit Additional Service" : "Add New Additional Service"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter service name"
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
                placeholder="30"
                value={formData.duration}
                onChange={handleChange}
                className="bg-black/40 border-gold/30 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter service description"
              value={formData.description}
              onChange={handleChange}
              className="bg-black/40 border-gold/30 text-white min-h-[80px]"
              required
            />
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
              {isEditing ? "Update Service" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
