
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon, Plus, Minus, Edit, Trash2 } from "lucide-react";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
};

interface InventoryListProps {
  items: InventoryItem[];
  vanName: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAdjustQuantity: (id: string, amount: number) => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const InventoryList = ({
  items,
  vanName,
  searchTerm,
  onSearchChange,
  onAdjustQuantity,
  onEditItem,
  onDeleteItem
}: InventoryListProps) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="text-white">Current Inventory - {vanName}</CardTitle>
        
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
          <Input 
            placeholder="Search inventory..." 
            className="pl-9 bg-black/40 border-gold/30 text-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow>
                <TableHead className="text-gold">Item Name</TableHead>
                <TableHead className="text-gold">Category</TableHead>
                <TableHead className="text-gold text-center">Stock Level</TableHead>
                <TableHead className="text-gold text-center">Quantity</TableHead>
                <TableHead className="text-gold">Last Restocked</TableHead>
                <TableHead className="text-gold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id} className="border-gold/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{item.name}</TableCell>
                    <TableCell className="text-white/70">{item.category}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.quantity <= item.minLevel 
                            ? "bg-red-500/20 text-red-400" 
                            : "bg-green-500/20 text-green-400"
                        }`}>
                          {item.quantity <= item.minLevel ? "Low" : "OK"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white text-center">{item.quantity}</TableCell>
                    <TableCell className="text-white/70">{item.lastRestocked}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                          onClick={() => onAdjustQuantity(item.id, -1)}
                          disabled={item.quantity <= 0}
                        >
                          <Minus size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                          onClick={() => onAdjustQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                          onClick={() => onEditItem(item)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-white/60">
                    No inventory items found for this van
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryList;
