
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, Filter } from "lucide-react";
import InvoiceTable from "./InvoiceTable";
import { Invoice } from "@/hooks/useInvoiceReport";

interface InvoiceManagementProps {
  invoices: Invoice[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formatCurrency: (amount: number) => string;
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  formatCurrency
}) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-white">Invoice Management</CardTitle>
            <CardDescription className="text-gold/70">
              View and manage customer invoices
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
              <Input 
                placeholder="Search invoices..." 
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
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} defaultValue="all">
          <TabsContent value="all">
            <InvoiceTable invoices={invoices} formatCurrency={formatCurrency} />
          </TabsContent>
          
          <TabsContent value="paid">
            <div className="text-center py-8 text-white/60">
              Showing only paid invoices
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="text-center py-8 text-white/60">
              Showing only pending invoices
            </div>
          </TabsContent>
          
          <TabsContent value="overdue">
            <div className="text-center py-8 text-white/60">
              Showing only overdue invoices
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvoiceManagement;
