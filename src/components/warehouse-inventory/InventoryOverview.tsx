
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, AlertTriangle } from "lucide-react";

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

interface InventoryOverviewProps {
  inventory: InventoryItem[];
  onAddNewItem: () => void;
  onExportInventory: () => void;
  onCheckLowStock: () => void;
}

const InventoryOverview = ({
  inventory,
  onAddNewItem,
  onExportInventory,
  onCheckLowStock
}: InventoryOverviewProps) => {
  const calculateCurrentStock = (item: InventoryItem) => {
    const allocated = Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
    return Math.max(0, item.stockIn - item.stockOut - allocated);
  };

  const lowStockItems = inventory.filter(item => {
    const current = calculateCurrentStock(item);
    return current <= item.reorderPoint && current > 0;
  });

  const outOfStockItems = inventory.filter(item => calculateCurrentStock(item) === 0);
  const uniqueCategories = new Set(inventory.map(item => item.category));

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Total Products</p>
            <p className="text-white text-2xl font-bold">{inventory.length}</p>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Low Stock Items</p>
            <p className="text-amber-500 text-2xl font-bold">
              {lowStockItems.length}
            </p>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Out of Stock</p>
            <p className="text-red-500 text-2xl font-bold">
              {outOfStockItems.length}
            </p>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Categories</p>
            <p className="text-white text-2xl font-bold">
              {uniqueCategories.size}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg" onClick={onAddNewItem}>
            <Plus size={16} className="mr-2" />
            Add New Item
          </Button>
          
          <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20" onClick={onExportInventory}>
            <FileDown size={16} className="mr-2" />
            Export Inventory
          </Button>
          
          <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20" onClick={onCheckLowStock}>
            <AlertTriangle size={16} className="mr-2" />
            Check Low Stock
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryOverview;
