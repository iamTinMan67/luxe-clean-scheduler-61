
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
};

type Van = {
  id: string;
  registration: string;
  name: string;
};

// Form schema for inventory item
const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  minLevel: z.coerce.number().min(0, "Minimum level must be at least 0"),
  vanId: z.string().min(1, "Van is required"),
});

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: z.infer<typeof inventoryItemSchema>) => void;
  editItem: InventoryItem | null;
  vans: Van[];
  activeVanId: string;
}

const ItemFormDialog = ({
  isOpen,
  onOpenChange,
  onSave,
  editItem,
  vans,
  activeVanId
}: ItemFormDialogProps) => {
  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      minLevel: 0,
      vanId: activeVanId,
    },
  });

  // Reset form when edit item changes
  useEffect(() => {
    if (editItem) {
      form.reset({
        name: editItem.name,
        category: editItem.category,
        quantity: editItem.quantity,
        minLevel: editItem.minLevel,
        vanId: editItem.vanId,
      });
    } else {
      form.reset({
        name: "",
        category: "",
        quantity: 0,
        minLevel: 0,
        vanId: activeVanId,
      });
    }
  }, [editItem, form, activeVanId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-gold/30 text-white">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Item Name</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Category</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Minimum Level</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="vanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Assign to Van</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
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
                {editItem ? "Update Item" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
