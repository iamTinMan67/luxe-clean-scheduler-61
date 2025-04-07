import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Plus, FileDown, Filter, AlertTriangle, Edit, Trash2, TruckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  allocatedStock: { [vanReg: string]: number };
};

type Van = {
  id: string;
  registration: string;
  name: string;
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

// Form schema for allocating stock
const allocateStockSchema = z.object({
  vanId: z.string().min(1, "Van is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const WarehouseInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [selectedItemForAllocation, setSelectedItemForAllocation] = useState<InventoryItem | null>(null);

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

  const allocateForm = useForm<z.infer<typeof allocateStockSchema>>({
    resolver: zodResolver(allocateStockSchema),
    defaultValues: {
      vanId: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    // Try to load inventory from localStorage
    const savedInventory = localStorage.getItem('warehouseInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Ensure all items have allocatedStock property
        const updatedInventory = parsedInventory.map((item: InventoryItem) => ({
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
      // Save to localStorage for future
      localStorage.setItem('warehouseInventory', JSON.stringify(getDefaultInventory()));
    }

    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('warehouseInventory', JSON.stringify(inventory));
  }, [inventory]);

  // Save to localStorage whenever vans change
  useEffect(() => {
    localStorage.setItem('vans', JSON.stringify(vans));
  }, [vans]);

  // Reset form when edit item changes
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

  const getDefaultInventory = (): InventoryItem[] => {
    return [
      {
        id: "1", 
        name: "Microfiber Cloths (Pack of 50)", 
        category: "Cleaning", 
        stockIn: 100, 
        stockOut: 35, 
        dateAdded: "2023-03-15", 
        lastUpdated: "2023-05-20",
        supplier: "CleanSupplies Inc.",
        reorderPoint: 20,
        allocatedStock: {}
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
        reorderPoint: 10,
        allocatedStock: {}
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
        reorderPoint: 15,
        allocatedStock: {}
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
        reorderPoint: 15,
        allocatedStock: {}
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
        reorderPoint: 8,
        allocatedStock: {}
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
        reorderPoint: 5,
        allocatedStock: {}
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
        reorderPoint: 5,
        allocatedStock: {}
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
        reorderPoint: 3,
        allocatedStock: {}
      },
    ];
  };

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  // Filter items based on search term and active tab
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low") return matchesSearch && (item.stockIn - item.stockOut - getTotalAllocated(item)) <= item.reorderPoint;
    if (activeTab === "out") return matchesSearch && (item.stockIn - item.stockOut - getTotalAllocated(item)) === 0;
    
    return matchesSearch;
  });

  // Calculate total allocated stock for an item
  const getTotalAllocated = (item: InventoryItem): number => {
    return Object.values(item.allocatedStock).reduce((sum, qty) => sum + qty, 0);
  };

  // Calculate current stock
  const currentStock = (item: InventoryItem) => Math.max(0, item.stockIn - item.stockOut - getTotalAllocated(item));

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted", {
      description: "The inventory item has been removed"
    });
  };

  const handleSaveItem = (values: z.infer<typeof inventoryItemSchema>) => {
    const now = new Date().toISOString().split('T')[0];
    
    if (editItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editItem.id 
          ? { 
              ...item, 
              ...values, 
              lastUpdated: now 
            }
          : item
      ));
      toast.success("Item updated", {
        description: "The inventory item has been updated"
      });
    } else {
      // Add new item - FIX: Ensure all required properties are provided
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: values.name,
        category: values.category,
        stockIn: values.stockIn,
        stockOut: values.stockOut,
        supplier: values.supplier,
        reorderPoint: values.reorderPoint,
        dateAdded: now,
        lastUpdated: now,
        allocatedStock: {}
      };
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added", {
        description: "New item added to inventory"
      });
    }
    
    setIsEditDialogOpen(false);
  };

  const handleExportInventory = () => {
    toast.success("Inventory exported", {
      description: "The inventory report has been generated"
    });
  };

  const handleCheckLowStock = () => {
    const lowStockItems = inventory.filter(
      item => currentStock(item) <= item.reorderPoint && currentStock(item) > 0
    );
    
    toast.info(`${lowStockItems.length} items with low stock found`, {
      description: "Check the Low Stock tab for details"
    });
    
    setActiveTab("low");
  };

  const handleAllocateStock = (item: InventoryItem) => {
    setSelectedItemForAllocation(item);
    allocateForm.reset({
      vanId: "",
      quantity: 1
    });
    setIsAllocateDialogOpen(true);
  };

  const handleSaveAllocation = (values: z.infer<typeof allocateStockSchema>) => {
    if (!selectedItemForAllocation) return;
    
    const selectedVan = vans.find(van => van.id === values.vanId);
    if (!selectedVan) return;
    
    const availableStock = selectedItemForAllocation.stockIn - selectedItemForAllocation.stockOut - getTotalAllocated(selectedItemForAllocation);
    
    if (values.quantity > availableStock) {
      toast.error("Insufficient stock", {
        description: `Only ${availableStock} units available for allocation`
      });
      return;
    }
    
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItemForAllocation.id) {
        const updatedAllocatedStock = { ...item.allocatedStock };
        updatedAllocatedStock[selectedVan.registration] = (updatedAllocatedStock[selectedVan.registration] || 0) + values.quantity;
        
        return {
          ...item,
          allocatedStock: updatedAllocatedStock,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    
    toast.success("Stock allocated", {
      description: `${values.quantity} units allocated to ${selectedVan.registration}`
    });
    
    setIsAllocateDialogOpen(false);
  };

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
                  {inventory.filter(item => {
                    const current = currentStock(item);
                    return current <= item.reorderPoint && current > 0;
                  }).length}
                </p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                <p className="text-white/70 text-sm mb-1">Out of Stock</p>
                <p className="text-red-500 text-2xl font-bold">
                  {inventory.filter(item => currentStock(item) === 0).length}
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
              <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg" onClick={handleAddNewItem}>
                <Plus size={16} className="mr-2" />
                Add New Item
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20" onClick={handleExportInventory}>
                <FileDown size={16} className="mr-2" />
                Export Inventory
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20" onClick={handleCheckLowStock}>
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
                      <TableHead className="text-gold text-center">Allocated</TableHead>
                      <TableHead className="text-gold text-center">Available</TableHead>
                      <TableHead className="text-gold">Last Updated</TableHead>
                      <TableHead className="text-gold">Status</TableHead>
                      <TableHead className="text-gold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
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
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                                onClick={() => handleAllocateStock(item)}
                                disabled={available === 0}
                              >
                                <TruckIcon size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-white/60">
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

      {/* Dialog for adding/editing items */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-gold/30 text-white">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveItem)} className="space-y-4">
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
                  onClick={() => setIsEditDialogOpen(false)}
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

      {/* Dialog for allocating stock to van */}
      <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
        <DialogContent className="bg-black/90 border-gold/30 text-white">
          <DialogHeader>
            <DialogTitle>Allocate Stock to Van</DialogTitle>
          </DialogHeader>
          {selectedItemForAllocation && (
            <div className="mb-4">
              <p className="text-white">Product: <span className="font-semibold">{selectedItemForAllocation.name}</span></p>
              <p className="text-white/70">Available: <span className="font-semibold text-green-500">
                {currentStock(selectedItemForAllocation)}
              </span> units</p>
            </div>
          )}
          <Form {...allocateForm}>
            <form onSubmit={allocateForm.handleSubmit(handleSaveAllocation)} className="space-y-4">
              <FormField
                control={allocateForm.control}
                name="vanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Select Van</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/40 border-gold/30 text-white">
                          <SelectValue placeholder="Select a van" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black/90 border-gold/30 text-white">
                        {vans.map((van) => (
                          <SelectItem key={van.id} value={van.id} className="hover:bg-gold/20">
                            {van.registration} - {van.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={allocateForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="bg-black/40 border-gold/30 text-white" 
                        min={1} 
                        max={selectedItemForAllocation ? currentStock(selectedItemForAllocation) : 1}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gold/30 text-white hover:bg-gold/20"
                  onClick={() => setIsAllocateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                  Allocate Stock
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default WarehouseInventory;
