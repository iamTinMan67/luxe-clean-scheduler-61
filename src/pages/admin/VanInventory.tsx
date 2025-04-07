import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchIcon, Plus, Minus, RefreshCw, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  lastRestocked: string;
  vanId: string;
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
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  minLevel: z.coerce.number().min(0, "Minimum level must be at least 0"),
  vanId: z.string().min(1, "Van is required"),
});

// Form schema for van
const vanSchema = z.object({
  registration: z.string().min(1, "Registration is required"),
  name: z.string().min(1, "Name is required"),
});

const VanInventory = () => {
  // States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [vans, setVans] = useState<Van[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVanId, setActiveVanId] = useState<string>("");
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVanDialogOpen, setIsVanDialogOpen] = useState(false);
  const [editVan, setEditVan] = useState<Van | null>(null);

  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      minLevel: 0,
      vanId: "",
    },
  });

  const vanForm = useForm<z.infer<typeof vanSchema>>({
    resolver: zodResolver(vanSchema),
    defaultValues: {
      registration: "",
      name: "",
    },
  });

  useEffect(() => {
    // Try to load inventory from localStorage
    const savedInventory = localStorage.getItem('vanInventory');
    if (savedInventory) {
      try {
        const parsedInventory = JSON.parse(savedInventory);
        // Update structure if missing vanId
        const updatedInventory = parsedInventory.map((item: InventoryItem) => ({
          ...item,
          vanId: item.vanId || "1", // Default to first van if none specified
        }));
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Error parsing van inventory:', error);
        // Set default data if error
        setInventory(getDefaultInventory());
      }
    } else {
      // Set default data if none exists
      setInventory(getDefaultInventory());
      // Save to localStorage for future
      localStorage.setItem('vanInventory', JSON.stringify(getDefaultInventory()));
    }

    // Load vans from localStorage
    const savedVans = localStorage.getItem('vans');
    if (savedVans) {
      try {
        const parsedVans = JSON.parse(savedVans);
        setVans(parsedVans);
        // Set active van to first one if it exists
        if (parsedVans.length > 0 && !activeVanId) {
          setActiveVanId(parsedVans[0].id);
        }
      } catch (error) {
        console.error('Error parsing vans:', error);
        // Set default vans if error
        const defaultVans = getDefaultVans();
        setVans(defaultVans);
        setActiveVanId(defaultVans[0].id);
        localStorage.setItem('vans', JSON.stringify(defaultVans));
      }
    } else {
      // Set default vans if none exists
      const defaultVans = getDefaultVans();
      setVans(defaultVans);
      setActiveVanId(defaultVans[0].id);
      localStorage.setItem('vans', JSON.stringify(defaultVans));
    }
  }, []);

  // Set active van if not set yet
  useEffect(() => {
    if (vans.length > 0 && !activeVanId) {
      setActiveVanId(vans[0].id);
    }
  }, [vans, activeVanId]);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem('vanInventory', JSON.stringify(inventory));
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
        quantity: editItem.quantity,
        minLevel: editItem.minLevel,
        vanId: editItem.vanId,
      });
    } else {
      form.reset({
        name: "",
        category: "",
        quantity: 0,
        minLevel: 0,
        vanId: activeVanId,
      });
    }
  }, [editItem, form, activeVanId]);

  // Reset van form when edit van changes
  useEffect(() => {
    if (editVan) {
      vanForm.reset({
        registration: editVan.registration,
        name: editVan.name,
      });
    } else {
      vanForm.reset({
        registration: "",
        name: "",
      });
    }
  }, [editVan, vanForm]);

  const getDefaultInventory = (): InventoryItem[] => {
    return [
      { id: "1", name: "Microfiber Cloths", category: "Cleaning", quantity: 24, minLevel: 10, lastRestocked: "2023-05-15", vanId: "1" },
      { id: "2", name: "Interior Cleaner", category: "Chemicals", quantity: 3, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "3", name: "Glass Cleaner", category: "Chemicals", quantity: 2, minLevel: 2, lastRestocked: "2023-05-10", vanId: "1" },
      { id: "4", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-01", vanId: "1" },
      { id: "5", name: "Detailing Brushes", category: "Tools", quantity: 8, minLevel: 5, lastRestocked: "2023-04-28", vanId: "1" },
      { id: "6", name: "Pressure Washer", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "7", name: "Vacuum Cleaner", category: "Equipment", quantity: 1, minLevel: 1, lastRestocked: "2023-03-15", vanId: "1" },
      { id: "8", name: "Wax", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-05", vanId: "1" },
      { id: "9", name: "Microfiber Cloths", category: "Cleaning", quantity: 18, minLevel: 8, lastRestocked: "2023-05-12", vanId: "2" },
      { id: "10", name: "Interior Cleaner", category: "Chemicals", quantity: 2, minLevel: 1, lastRestocked: "2023-05-08", vanId: "2" },
      { id: "11", name: "Tire Shine", category: "Chemicals", quantity: 1, minLevel: 1, lastRestocked: "2023-05-03", vanId: "2" },
    ];
  };

  const getDefaultVans = (): Van[] => {
    return [
      { id: "1", registration: "AB12 CDE", name: "Van 1" },
      { id: "2", registration: "FG34 HIJ", name: "Van 2" },
    ];
  };

  // Filter items based on search term and active van
  const filteredItems = inventory.filter(item => 
    item.vanId === activeVanId && (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle quantity change
  const adjustQuantity = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + amount);
        
        // If item from warehouse allocation is consumed, update warehouse inventory
        if (amount < 0) {
          // TODO: Implement warehouse stock sync if needed
          // Currently handled by setting allocated stock to 0 in warehouse when van updates
        }
        
        return { 
          ...item, 
          quantity: newQuantity,
          lastRestocked: amount > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked 
        };
      }
      return item;
    }));
    
    // Update warehouse allocated stock when van inventory changes
    if (amount !== 0) {
      // Try to clear allocations from the updated van
      try {
        const warehouseInventory = localStorage.getItem('warehouseInventory');
        if (warehouseInventory) {
          const parsedInventory = JSON.parse(warehouseInventory);
          const currentVan = vans.find(van => van.id === activeVanId);
          
          if (currentVan) {
            const updatedWarehouseInventory = parsedInventory.map((item: any) => {
              if (item.allocatedStock && item.allocatedStock[currentVan.registration]) {
                const updatedAllocatedStock = { ...item.allocatedStock };
                // Clear the allocation for this van
                updatedAllocatedStock[currentVan.registration] = 0;
                return {
                  ...item,
                  allocatedStock: updatedAllocatedStock,
                  lastUpdated: new Date().toISOString().split('T')[0]
                };
              }
              return item;
            });
            
            localStorage.setItem('warehouseInventory', JSON.stringify(updatedWarehouseInventory));
          }
        }
      } catch (error) {
        console.error('Error updating warehouse allocations:', error);
      }
    }
    
    toast.success(`Inventory quantity updated`, {
      description: amount > 0 ? "Item quantity increased" : "Item quantity decreased"
    });
  };

  const handleRestockRequest = () => {
    // Find low stock items
    const lowStockItems = inventory.filter(item => item.vanId === activeVanId && item.quantity <= item.minLevel);
    
    if (lowStockItems.length > 0) {
      toast.success(`Restock request sent for ${lowStockItems.length} items`, {
        description: "The warehouse will process your request soon"
      });
    } else {
      toast.info("No items need restocking at this time");
    }
  };

  const handleAddItem = () => {
    setEditItem(null);
    form.reset({
      name: "",
      category: "",
      quantity: 0,
      minLevel: 0,
      vanId: activeVanId,
    });
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
    if (editItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editItem.id 
          ? { 
              ...item, 
              ...values, 
              lastRestocked: values.quantity > item.quantity 
                ? new Date().toISOString().split('T')[0] 
                : item.lastRestocked 
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
        quantity: values.quantity,
        minLevel: values.minLevel,
        vanId: values.vanId,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added", {
        description: "New item added to van inventory"
      });
    }
    
    setIsEditDialogOpen(false);
  };

  const handleAddVan = () => {
    setEditVan(null);
    setIsVanDialogOpen(true);
  };

  const handleEditVan = (van: Van) => {
    setEditVan(van);
    setIsVanDialogOpen(true);
  };

  const handleDeleteVan = (id: string) => {
    if (vans.length <= 1) {
      toast.error("Cannot delete the only van", {
        description: "You must have at least one van in the system"
      });
      return;
    }
    
    // Delete van and its inventory
    setVans(prev => prev.filter(van => van.id !== id));
    setInventory(prev => prev.filter(item => item.vanId !== id));
    
    // If active van is deleted, set active van to first available
    if (activeVanId === id && vans.length > 1) {
      const remainingVans = vans.filter(van => van.id !== id);
      if (remainingVans.length > 0) {
        setActiveVanId(remainingVans[0].id);
      }
    }
    
    toast.success("Van deleted", {
      description: "The van and its inventory have been removed"
    });
  };

  const handleSaveVan = (values: z.infer<typeof vanSchema>) => {
    if (editVan) {
      // Update existing van
      setVans(prev => prev.map(van => 
        van.id === editVan.id 
          ? { ...van, ...values }
          : van
      ));
      toast.success("Van updated", {
        description: "The van details have been updated"
      });
    } else {
      // Add new van - FIX: Ensure all required properties are provided
      const newVan: Van = {
        id: Date.now().toString(),
        registration: values.registration,
        name: values.name
      };
      setVans(prev => [...prev, newVan]);
      
      // Set as active van if it's the first one
      if (vans.length === 0) {
        setActiveVanId(newVan.id);
      }
      
      toast.success("Van added", {
        description: "New van added to the system"
      });
    }
    
    setIsVanDialogOpen(false);
  };

  // Get current van
  const currentVan = vans.find(van => van.id === activeVanId) || { id: "", registration: "", name: "" };

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

      {/* Van selection tabs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Select Van</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gold/30 text-white hover:bg-gold/20"
            onClick={handleAddVan}
          >
            <Plus size={14} className="mr-1" /> Add Van
          </Button>
        </div>
        <Tabs value={activeVanId} onValueChange={setActiveVanId} className="mb-6">
          <TabsList className="bg-black/60">
            {vans.map((van) => (
              <TabsTrigger key={van.id} value={van.id} className="flex items-center gap-2">
                {van.registration}
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-xs text-white/70">({van.name})</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-gold/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditVan(van);
                    }}
                  >
                    <Edit size={10} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVan(van.id);
                    }}
                  >
                    <Trash2 size={10} />
                  </Button>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                <span>Van Inventory</span>
                <span className="text-sm font-normal text-gold">{currentVan.registration}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Total Items</p>
                  <p className="text-white text-2xl font-bold">
                    {inventory.filter(item => item.vanId === activeVanId).length}
                  </p>
                </div>
                
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Low Stock Items</p>
                  <p className="text-red-500 text-2xl font-bold">
                    {inventory.filter(item => item.vanId === activeVanId && item.quantity <= item.minLevel).length}
                  </p>
                </div>
                
                <div className="p-3 border border-gold/20 rounded-md">
                  <p className="text-white/70 text-sm">Categories</p>
                  <p className="text-white text-2xl font-bold">
                    {new Set(inventory.filter(item => item.vanId === activeVanId).map(item => item.category)).size}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg" onClick={handleRestockRequest}>
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
              <Button onClick={handleAddItem} className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                <Plus size={16} className="mr-2" />
                Add New Item
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-white">Current Inventory - {currentVan.name}</CardTitle>
              
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
                      <TableHead className="text-gold">Last Restocked</TableHead>
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
                        <TableCell className="text-white/70">{item.lastRestocked}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 border-gold/30 text-white hover:bg-gold/20"
                              onClick={() => adjustQuantity(item.id, -1)}
                              disabled={item.quantity <= 0}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredItems.length === 0 && (
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
                    <FormLabel className="text-white">Item Name</FormLabel>
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
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Minimum Level</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-black/40 border-gold/30 text-white" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="vanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Assign to Van</FormLabel>
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

      {/* Dialog for adding/editing vans */}
      <Dialog open={isVanDialogOpen} onOpenChange={setIsVanDialogOpen}>
        <DialogContent className="bg-black/90 border-gold/30 text-white">
          <DialogHeader>
            <DialogTitle>{editVan ? "Edit Van" : "Add New Van"}</DialogTitle>
          </DialogHeader>
          <Form {...vanForm}>
            <form onSubmit={vanForm.handleSubmit(handleSaveVan)} className="space-y-4">
              <FormField
                control={vanForm.control}
                name="registration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Registration Number</FormLabel>
                    <FormControl>
                      <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={vanForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Van Name</FormLabel>
                    <FormControl>
                      <Input className="bg-black/40 border-gold/30 text-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-gold/30 text-white hover:bg-gold/20"
                  onClick={() => setIsVanDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                  {editVan ? "Update Van" : "Add Van"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default VanInventory;
