
import { z } from "zod";

// Form schema for inventory item
export const warehouseItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  stockIn: z.coerce.number().min(0, "Stock in must be at least 0"),
  stockOut: z.coerce.number().min(0, "Stock out must be at least 0"),
  supplier: z.string().min(1, "Supplier is required"),
  reorderPoint: z.coerce.number().min(0, "Reorder point must be at least 0"),
});

export type WarehouseItem = {
  id: string;
  name: string;
  category: string;
  stockIn: number;
  stockOut: number;
  dateAdded: string;
  lastUpdated: string;
  supplier: string;
  reorderPoint: number;
  allocatedStock: Record<string, number>;
};
