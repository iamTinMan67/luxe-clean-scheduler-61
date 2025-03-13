
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon, Plus, Minus, RefreshCw } from "lucide-react";

// Example inventory item type
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
};

const VanInventory = () => {
  // Sample inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", name: "Microfiber Cloths", category: "Cleaning", quantity: 24, minLevel: 10, lastRestocked: "2023-05-15" },
    { id: "2", name: "Interior Cleaner", category: "Chemicals", quantity: 3, minLevel: 2, lastRestocked: "2023-05-10" },
    { id: "3", name: "Glass Cleaner", category: "Chemicals", quantity: 2, minLevel: 2, lastRestocked: "2023-05-10" },
    { id: "4", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-01" },
    { id: "5", name: "Detailing Brushes", category: "Tools", quantity: 8, minLevel: 5, lastRestocked: "2023-04-28" },
    { id: "6", name: "Pressure Washer", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15" },
    { id: "7", name: "Vacuum Cleaner", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15" },
    { id: "8", name: "Wax", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-05" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on search term
  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle quantity change
  const adjustQuantity = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Van Inventory</h1>
        <p className="text-gold">Manage your mobile service vehicle inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Total Items</p>
                  <p className="text-white text-2xl font-bold">{inventory.length}</p>
                </div>
                
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Low Stock Items</p>
                  <p className="text-red-500 text-2xl font-bold">
                    {inventory.filter(item => item.quantity <= item.minLevel).length}
                  </p>
                </div>
                
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Categories</p>
                  <p className="text-white text-2xl font-bold">
                    {new Set(inventory.map(item => item.category)).size}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
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
              <form className="space-y-4">
                <div>
                  <label htmlFor="itemName" className="text-white text-sm font-medium block mb-1">
                    Item Name
                  </label>
                  <Input id="itemName" className="bg-black/40 border-gold/30 text-white" placeholder="Enter item name" />
                </div>
                
                <div>
                  <label htmlFor="category" className="text-white text-sm font-medium block mb-1">
                    Category
                  </label>
                  <Input id="category" className="bg-black/40 border-gold/30 text-white" placeholder="Enter category" />
                </div>
                
                <div>
                  <label htmlFor="quantity" className="text-white text-sm font-medium block mb-1">
                    Quantity
                  </label>
                  <Input id="quantity" type="number" min="1" className="bg-black/40 border-gold/30 text-white" placeholder="Enter quantity" />
                </div>
                
                <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                  <Plus size={16} className="mr-2" />
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-white">Current Inventory</CardTitle>
              
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                <Input 
                  placeholder="Search inventory..." 
                  className="pl-9 bg-black/40 border-gold/30 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                      <TableHead className="text-gold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                              onClick={() => adjustQuantity(item.id, -1)}
                            >
                              <Minus size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                              onClick={() => adjustQuantity(item.id, 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-white/60">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default VanInventory;
