
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stockIn: number;
  stockOut: number;
  dateAdded: string;
  lastUpdated: string;
  supplier: string;
  reorderPoint: number;
  allocatedStock: { [vanReg: string]: number };
};

type Van = {
  id: string;
  registration: string;
  name: string;
};

// Form schema for allocating stock
const allocateStockSchema = z.object({
  vanId: z.string().min(1, "Van is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

interface AllocateStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  vans: Van[];
  onSave: (values: z.infer<typeof allocateStockSchema>) => void;
  currentStock: (item: InventoryItem) => number;
}

const AllocateStockDialog = ({
  open,
  onOpenChange,
  item,
  vans,
  onSave,
  currentStock
}: AllocateStockDialogProps) => {
  const form = useForm<z.infer<typeof allocateStockSchema>>({
    resolver: zodResolver(allocateStockSchema),
    defaultValues: {
      vanId: "",
      quantity: 1,
    },
  });

  // Reset form when dialog opens with new item
  React.useEffect(() => {
    if (open && item) {
      form.reset({
        vanId: "",
        quantity: 1
      });
    }
  }, [open, item, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-gold/30 text-white">
        <DialogHeader>
          <DialogTitle>Allocate Stock to Van</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="mb-4">
            <p className="text-white">Product: <span className="font-semibold">{item.name}</span></p>
            <p className="text-white/70">Available: <span className="font-semibold text-green-500">
              {currentStock(item)}
            </span> units</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="vanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Select Van</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/40 border-gold/30 text-white">
                        <SelectValue placeholder="Select a van" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black/90 border-gold/30 text-white">
                      {vans.map((van) => (
                        <SelectItem key={van.id} value={van.id} className="hover:bg-gold/20">
                          {van.registration} - {van.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="bg-black/40 border-gold/30 text-white" 
                      min={1} 
                      max={item ? currentStock(item) : 1}
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                className="border-gold/30 text-white hover:bg-gold/20"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                Allocate Stock
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateStockDialog;
