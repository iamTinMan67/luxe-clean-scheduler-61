
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, TruckIcon } from "lucide-react";

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

interface InventoryTableProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onAllocateStock: (item: InventoryItem) => void;
}

const InventoryTable = ({
  items,
  onEditItem,
  onDeleteItem,
  onAllocateStock
}: InventoryTableProps) => {
  // Calculate total allocated stock for an item
  const getTotalAllocated = (item: InventoryItem): number => {
    return Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
  };

  // Calculate current stock
  const currentStock = (item: InventoryItem) => Math.max(0, item.stockIn - item.stockOut - getTotalAllocated(item));

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-black/40">
          <TableRow>
            <TableHead className="text-gold">Product Name</TableHead>
            <TableHead className="text-gold">Category</TableHead>
            <TableHead className="text-gold text-center">Stock In</TableHead>
            <TableHead className="text-gold text-center">Stock Out</TableHead>
            <TableHead className="text-gold text-center">Allocated</TableHead>
            <TableHead className="text-gold text-center">Available</TableHead>
            <TableHead className="text-gold">Last Updated</TableHead>
            <TableHead className="text-gold">Status</TableHead>
            <TableHead className="text-gold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => {
              const allocated = getTotalAllocated(item);
              const available = currentStock(item);
              let status = "normal";
              if (available === 0) status = "out";
              else if (available <= item.reorderPoint) status = "low";
              
              return (
                <TableRow key={item.id} className="border-gold/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{item.name}</TableCell>
                  <TableCell className="text-white/70">{item.category}</TableCell>
                  <TableCell className="text-center text-white">{item.stockIn}</TableCell>
                  <TableCell className="text-center text-white">{item.stockOut}</TableCell>
                  <TableCell className="text-center text-white">{allocated}</TableCell>
                  <TableCell className="text-center font-medium">
                    <span className={
                      status === "out" ? "text-red-500" : 
                      status === "low" ? "text-amber-500" : 
                      "text-green-500"
                    }>
                      {available}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/70">{item.lastUpdated}</TableCell>
                  <TableCell>
                    {status === "out" && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        Out of Stock
                      </Badge>
                    )}
                    {status === "low" && (
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
                        Low Stock
                      </Badge>
                    )}
                    {status === "normal" && (
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
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
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                        onClick={() => onAllocateStock(item)}
                        disabled={available === 0}
                      >
                        <TruckIcon size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-white/60">
                No inventory items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
