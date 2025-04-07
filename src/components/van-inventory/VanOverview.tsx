
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw, Plus } from "lucide-react";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
};

interface VanOverviewProps {
  vanRegistration: string;
  inventory: InventoryItem[];
  activeVanId: string;
  onRestockRequest: () => void;
  onAddItem: () => void;
}

const VanOverview = ({
  vanRegistration,
  inventory,
  activeVanId,
  onRestockRequest,
  onAddItem
}: VanOverviewProps) => {
  const vanInventory = inventory.filter(item => item.vanId === activeVanId);
  const lowStockItems = vanInventory.filter(item => item.quantity <= item.minLevel);
  const uniqueCategories = new Set(vanInventory.map(item => item.category));

  return (
    <div className="space-y-6">
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            <span>Van Inventory</span>
            <span className="text-sm font-normal text-gold">{vanRegistration}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border border-gold/20 rounded-md">
              <p className="text-white/70 text-sm">Total Items</p>
              <p className="text-white text-2xl font-bold">
                {vanInventory.length}
              </p>
            </div>
            
            <div className="p-3 border border-gold/20 rounded-md">
              <p className="text-white/70 text-sm">Low Stock Items</p>
              <p className="text-red-500 text-2xl font-bold">
                {lowStockItems.length}
              </p>
            </div>
            
            <div className="p-3 border border-gold/20 rounded-md">
              <p className="text-white/70 text-sm">Categories</p>
              <p className="text-white text-2xl font-bold">
                {uniqueCategories.size}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg" onClick={onRestockRequest}>
              <RefreshCw size={16} className="mr-2" />
              Restock Request
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/60 border-gold/30">
        <CardHeader>
          <CardTitle className="text-white">Quick Add</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onAddItem} className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
            <Plus size={16} className="mr-2" />
            Add New Item
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VanOverview;
