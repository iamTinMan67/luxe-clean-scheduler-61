
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Filter } from "lucide-react";

interface InventoryFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const InventoryFilter = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab
}: InventoryFilterProps) => {
  return (
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
        {/* Table will be rendered here by parent component */}
      </CardContent>
    </Card>
  );
};

export default InventoryFilter;
