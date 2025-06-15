
import { useState, useEffect } from "react";
import { WarehouseItem } from "@/types/warehouseInventory";
import { getDefaultInventory } from "@/utils/warehouseInventoryUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function useInventoryStorage() {
  const [inventory, setInventory] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load inventory from Supabase database
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        // Get data from Supabase
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("location", "Warehouse");
        
        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform data to match our WarehouseItem type
          const transformedItems: WarehouseItem[] = data.map(item => {
            // Handle allocated_stock, ensuring it's a proper Record<string, number>
            let allocatedStock: Record<string, number> = {};
            
            if (item.allocated_stock) {
              if (typeof item.allocated_stock === 'object' && !Array.isArray(item.allocated_stock)) {
                // Convert each value to a number
                Object.entries(item.allocated_stock).forEach(([key, value]) => {
                  allocatedStock[key] = typeof value === 'number' ? value : Number(value) || 0;
                });
              }
            }
            
            return {
              id: item.id,
              name: item.name,
              category: item.category,
              stockIn: item.stock_in,
              stockOut: item.stock_out,
              dateAdded: new Date(item.created_at).toISOString().split('T')[0],
              lastUpdated: new Date(item.updated_at).toISOString().split('T')[0],
              supplier: item.supplier,
              reorderPoint: item.reorder_point,
              allocatedStock: allocatedStock
            };
          });
          
          setInventory(transformedItems);
        } else {
          // If no data in Supabase, initialize with default data
          const defaultItems = getDefaultInventory();
          setInventory(defaultItems);
          
          // Save default data to Supabase
          const transformedForDb = defaultItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            stock_in: item.stockIn,
            stock_out: item.stockOut,
            supplier: item.supplier,
            reorder_point: item.reorderPoint,
            allocated_stock: item.allocatedStock || {},
            location: "Warehouse",
            created_at: new Date(item.dateAdded).toISOString(),
            updated_at: new Date(item.lastUpdated).toISOString()
          }));
          
          const { error: insertError } = await supabase
            .from("inventory_items")
            .insert(transformedForDb);
          
          if (insertError) {
            console.error('Error saving default inventory:', insertError);
          }
        }
      } catch (error) {
        console.error('Error fetching inventory from database:', error);
        toast.error("Failed to load inventory data");
        
        // Fallback to default data
        setInventory(getDefaultInventory());
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Save to Supabase whenever inventory changes (but not on initial load)
  useEffect(() => {
    const saveInventory = async () => {
      if (inventory.length === 0 || loading) return;

      try {
        // Transform data for Supabase
        const items = inventory.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          stock_in: item.stockIn,
          stock_out: item.stockOut,
          supplier: item.supplier,
          reorder_point: item.reorderPoint,
          allocated_stock: item.allocatedStock || {},
          location: "Warehouse",
          updated_at: new Date().toISOString()
        }));

        // Upsert to Supabase
        const { error } = await supabase
          .from("inventory_items")
          .upsert(items, { onConflict: 'id' });

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error saving inventory to database:', error);
        toast.error("Failed to save inventory changes");
      }
    };

    // Only save if not loading (to avoid saving during initial fetch)
    if (!loading) {
      saveInventory();
    }
  }, [inventory, loading]);

  return {
    inventory,
    setInventory,
    loading
  };
}
