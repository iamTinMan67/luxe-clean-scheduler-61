
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

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

// Form schema for inventory item
const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  stockIn: z.coerce.number().min(0, "Stock in must be at least 0"),
  stockOut: z.coerce.number().min(0, "Stock out must be at least 0"),
  supplier: z.string().min(1, "Supplier is required"),
  reorderPoint: z.coerce.number().min(0, "Reorder point must be at least 0"),
});

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: InventoryItem | null;
  onSave: (values: z.infer<typeof inventoryItemSchema>) => void;
}

const ItemFormDialog = ({
  open,
  onOpenChange,
  editItem,
  onSave
}: ItemFormDialogProps) => {
  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      stockIn: 0,
      stockOut: 0,
      supplier: "",
      reorderPoint: 0,
    },
  });

  // Reset form when edit item changes - Added this effect to fix the issue
  useEffect(() => {
    if (editItem) {
      form.reset({
        name: editItem.name,
        category: editItem.category,
        stockIn: editItem.stockIn,
        stockOut: editItem.stockOut,
        supplier: editItem.supplier,
        reorderPoint: editItem.reorderPoint,
      });
    } else {
      form.reset({
        name: "",
        category: "",
        stockIn: 0,
        stockOut: 0,
        supplier: "",
        reorderPoint: 0,
      });
    }
  }, [editItem, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <FormLabel className="text-white">Product Name</FormLabel>
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
                name="stockIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Stock In</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Stock Out</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Supplier</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reorderPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Reorder Point</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
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
