
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Plus, FileDown, Filter, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types
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
};

const WarehouseInventory = () => {
  // Sample inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1", 
      name: "Microfiber Cloths (Pack of 50)", 
      category: "Cleaning", 
      stockIn: 100, 
      stockOut: 35, 
      dateAdded: "2023-03-15", 
      lastUpdated: "2023-05-20",
      supplier: "CleanSupplies Inc.",
      reorderPoint: 20
    },
    {
      id: "2", 
      name: "Premium Car Shampoo (5L)", 
      category: "Chemicals", 
      stockIn: 30, 
      stockOut: 12, 
      dateAdded: "2023-04-10", 
      lastUpdated: "2023-05-18",
      supplier: "AutoChem Ltd.",
      reorderPoint: 10
    },
    {
      id: "3", 
      name: "Interior Cleaner (1L)", 
      category: "Chemicals", 
      stockIn: 45, 
      stockOut: 28, 
      dateAdded: "2023-03-22", 
      lastUpdated: "2023-05-19",
      supplier: "AutoChem Ltd.",
      reorderPoint: 15
    },
    {
      id: "4", 
      name: "Tire Shine (500ml)", 
      category: "Chemicals", 
      stockIn: 50, 
      stockOut: 22, 
      dateAdded: "2023-04-05", 
      lastUpdated: "2023-05-15",
      supplier: "WheelGloss Co.",
      reorderPoint: 15
    },
    {
      id: "5", 
      name: "Detailing Brushes Set", 
      category: "Tools", 
      stockIn: 25, 
      stockOut: 18, 
      dateAdded: "2023-02-28", 
      lastUpdated: "2023-05-10",
      supplier: "DetailPro Tools",
      reorderPoint: 8
    },
    {
      id: "6", 
      name: "Clay Bar Kit", 
      category: "Detailing", 
      stockIn: 20, 
      stockOut: 15, 
      dateAdded: "2023-04-15", 
      lastUpdated: "2023-05-12",
      supplier: "SmoothSurface Inc.",
      reorderPoint: 5
    },
    {
      id: "7", 
      name: "Ceramic Coating (250ml)", 
      category: "Protection", 
      stockIn: 15, 
      stockOut: 9, 
      dateAdded: "2023-03-10", 
      lastUpdated: "2023-05-05",
      supplier: "ProCoat Systems",
      reorderPoint: 5
    },
    {
      id: "8", 
      name: "Pressure Washer Attachments", 
      category: "Equipment", 
      stockIn: 10, 
      stockOut: 4, 
      dateAdded: "2023-02-15", 
      lastUpdated: "2023-04-20",
      supplier: "WashTech Supplies",
      reorderPoint: 3
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter items based on search term and active tab
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low") return matchesSearch && (item.stockIn - item.stockOut) <= item.reorderPoint;
    if (activeTab === "out") return matchesSearch && (item.stockIn - item.stockOut) === 0;
    
    return matchesSearch;
  });

  // Calculate current stock
  const currentStock = (stockIn: number, stockOut: number) => Math.max(0, stockIn - stockOut);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Warehouse Inventory</h1>
        <p className="text-gold">Manage your main warehouse stock levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  {inventory.filter(item => currentStock(item.stockIn, item.stockOut) <= item.reorderPoint && currentStock(item.stockIn, item.stockOut) > 0).length}
                </p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Out of Stock</p>
                <p className="text-red-500 text-2xl font-bold">
                  {inventory.filter(item => currentStock(item.stockIn, item.stockOut) === 0).length}
                </p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Categories</p>
                <p className="text-white text-2xl font-bold">
                  {new Set(inventory.map(item => item.category)).size}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                <Plus size={16} className="mr-2" />
                Add New Item
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
                <FileDown size={16} className="mr-2" />
                Export Inventory
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
                <AlertTriangle size={16} className="mr-2" />
                Check Low Stock
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-white">Warehouse Inventory</CardTitle>
                  <CardDescription className="text-gold/70">
                    Manage stock levels, track inventory changes
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                    <Input 
                      placeholder="Search inventory..." 
                      className="pl-9 bg-black/40 border-gold/30 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="icon" className="border-gold/30 text-white hover:bg-gold/20">
                    <Filter size={16} />
                  </Button>
                </div>
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="mt-4"
              >
                <TabsList className="bg-black/60">
                  <TabsTrigger value="all">All Items</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                  <TabsTrigger value="out">Out of Stock</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow>
                      <TableHead className="text-gold">Product Name</TableHead>
                      <TableHead className="text-gold">Category</TableHead>
                      <TableHead className="text-gold text-center">Stock In</TableHead>
                      <TableHead className="text-gold text-center">Stock Out</TableHead>
                      <TableHead className="text-gold text-center">Current Stock</TableHead>
                      <TableHead className="text-gold">Last Updated</TableHead>
                      <TableHead className="text-gold text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const current = currentStock(item.stockIn, item.stockOut);
                      let status = "normal";
                      if (current === 0) status = "out";
                      else if (current <= item.reorderPoint) status = "low";
                      
                      return (
                        <TableRow key={item.id} className="border-gold/10 hover:bg-white/5">
                          <TableCell className="text-white font-medium">{item.name}</TableCell>
                          <TableCell className="text-white/70">{item.category}</TableCell>
                          <TableCell className="text-center text-white">{item.stockIn}</TableCell>
                          <TableCell className="text-center text-white">{item.stockOut}</TableCell>
                          <TableCell className="text-center font-medium">
                            <span className={
                              status === "out" ? "text-red-500" : 
                              status === "low" ? "text-amber-500" : 
                              "text-green-500"
                            }>
                              {current}
                            </span>
                          </TableCell>
                          <TableCell className="text-white/70">{item.lastUpdated}</TableCell>
                          <TableCell className="text-right">
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
                        </TableRow>
                      );
                    })}
                    
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-white/60">
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

export default WarehouseInventory;
