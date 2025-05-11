
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
        // Try to get data from Supabase
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("location", "Warehouse");
        
        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform data to match our WarehouseItem type
          const transformedItems: WarehouseItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            stockIn: item.stock_in,
            stockOut: item.stock_out,
            dateAdded: new Date(item.created_at).toISOString().split('T')[0],
            lastUpdated: new Date(item.updated_at).toISOString().split('T')[0],
            supplier: item.supplier,
            reorderPoint: item.reorder_point,
            allocatedStock: item.allocated_stock ? (typeof item.allocated_stock === 'object' ? item.allocated_stock : {}) : {}
          }));
          
          setInventory(transformedItems);
        } else {
          // Fallback to localStorage if no data in Supabase
          const savedInventory = localStorage.getItem('warehouseInventory');
          if (savedInventory) {
            try {
              const parsedInventory = JSON.parse(savedInventory);
              // Ensure all items have allocatedStock property
              const updatedInventory = parsedInventory.map((item: WarehouseItem) => ({
                ...item,
                allocatedStock: item.allocatedStock || {},
              }));
              setInventory(updatedInventory);
            } catch (error) {
              console.error('Error parsing warehouse inventory:', error);
              // Set default data if error
              setInventory(getDefaultInventory());
            }
          } else {
            // Set default data if none exists
            setInventory(getDefaultInventory());
          }
        }
      } catch (error) {
        console.error('Error fetching inventory from database:', error);
        toast.error("Failed to load inventory data");
        
        // Fall back to localStorage
        const savedInventory = localStorage.getItem('warehouseInventory');
        if (savedInventory) {
          try {
            setInventory(JSON.parse(savedInventory));
          } catch (e) {
            setInventory(getDefaultInventory());
          }
        } else {
          setInventory(getDefaultInventory());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Save to Supabase whenever inventory changes
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

        // First try to upsert to Supabase
        const { error } = await supabase
          .from("inventory_items")
          .upsert(items, { onConflict: 'id' });

        if (error) {
          throw error;
        }

        // Also save to localStorage as backup
        localStorage.setItem('warehouseInventory', JSON.stringify(inventory));
      } catch (error) {
        console.error('Error saving inventory to database:', error);
        // At least save to localStorage
        localStorage.setItem('warehouseInventory', JSON.stringify(inventory));
      }
    };

    saveInventory();
  }, [inventory, loading]);

  return {
    inventory,
    setInventory,
    loading
  };
}
