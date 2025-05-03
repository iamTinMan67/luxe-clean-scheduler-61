import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, FileDown, FileText, Filter, Eye, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
type Invoice = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  servicePackage: string;
  assignedStaff?: string;
};

const InvoiceReport = () => {
  // Sample invoice data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2023-001",
      customerName: "James Wilson",
      customerEmail: "james.w@example.com",
      date: "2023-05-15",
      dueDate: "2023-05-30",
      amount: 299.99,
      status: "paid",
      servicePackage: "Elite Package",
      assignedStaff: "David Lee"
    },
    {
      id: "INV-2023-002",
      customerName: "Emma Thompson",
      customerEmail: "emma.t@example.com",
      date: "2023-05-18",
      dueDate: "2023-06-02",
      amount: 199.99,
      status: "pending",
      servicePackage: "Medium Package"
    },
    {
      id: "INV-2023-003",
      customerName: "Michael Brown",
      customerEmail: "michael.b@example.com",
      date: "2023-05-10",
      dueDate: "2023-05-25",
      amount: 349.99,
      status: "overdue",
      servicePackage: "Elite Package + Ceramic Coating"
    },
    {
      id: "INV-2023-004",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@example.com",
      date: "2023-05-22",
      dueDate: "2023-06-06",
      amount: 149.99,
      status: "pending",
      servicePackage: "Basic Package"
    },
    {
      id: "INV-2023-005",
      customerName: "David Miller",
      customerEmail: "david.m@example.com",
      date: "2023-05-05",
      dueDate: "2023-05-20",
      amount: 399.99,
      status: "paid",
      servicePackage: "Elite Package + Interior Deep Clean",
      assignedStaff: "Sarah Johnson"
    },
    {
      id: "INV-2023-006",
      customerName: "Jennifer Smith",
      customerEmail: "jennifer.s@example.com",
      date: "2023-05-25",
      dueDate: "2023-06-09",
      amount: 249.99,
      status: "pending",
      servicePackage: "Medium Package + Leather Treatment"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(undefined);

  // Filter invoices based on search term, active tab, and selected staff
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.servicePackage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "paid" && invoice.status === "paid") ||
      (activeTab === "pending" && invoice.status === "pending") ||
      (activeTab === "overdue" && invoice.status === "overdue");
    
    const matchesStaff = 
      !selectedStaff || 
      invoice.assignedStaff === selectedStaff;
    
    return matchesSearch && matchesTab && matchesStaff;
  });

  const totals = {
    all: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    paid: invoices.filter(invoice => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0),
    pending: invoices.filter(invoice => invoice.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0),
    overdue: invoices.filter(invoice => invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  // Assign staff to an invoice
  const assignStaff = (invoiceId: string, staffName: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, assignedStaff: staffName } : invoice
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
        <h1 className="text-3xl font-bold text-white mb-2">Invoice Reports</h1>
        <p className="text-gold">Track payments and manage customer invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="all">
                <TabsContent value="all" className="m-0">
                  <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                    <p className="text-white/70 text-sm mb-1">Total Revenue</p>
                    <p className="text-white text-2xl font-bold">{formatCurrency(totals.all)}</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                  <p className="text-white/70 text-sm mb-1">Paid Invoices</p>
                  <p className="text-green-500 text-2xl font-bold">{formatCurrency(totals.paid)}</p>
                  <p className="text-white/50 text-xs mt-1">
                    {invoices.filter(i => i.status === "paid").length} invoices
                  </p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                  <p className="text-white/70 text-sm mb-1">Pending Invoices</p>
                  <p className="text-amber-500 text-2xl font-bold">{formatCurrency(totals.pending)}</p>
                  <p className="text-white/50 text-xs mt-1">
                    {invoices.filter(i => i.status === "pending").length} invoices
                  </p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-md border border-gold/20">
                  <p className="text-white/70 text-sm mb-1">Overdue Invoices</p>
                  <p className="text-red-500 text-2xl font-bold">{formatCurrency(totals.overdue)}</p>
                  <p className="text-white/50 text-xs mt-1">
                    {invoices.filter(i => i.status === "overdue").length} invoices
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gold-gradient text-black hover:shadow-gold/20 hover:shadow-lg">
                <FileText size={16} className="mr-2" />
                Create New Invoice
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
                <FileDown size={16} className="mr-2" />
                Export Reports
              </Button>
              
              <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/20">
                <Send size={16} className="mr-2" />
                Send Reminders
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-gold/30">
            <CardHeader>
              <CardTitle className="text-white">Staff Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="bg-black/40 border-gold/30 text-white">
                  <SelectValue placeholder="Filter by staff member" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gold/30">
                  <SelectItem value="">All Staff</SelectItem>
                  <SelectItem value="David Lee">David Lee</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
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
              
                <TabsContent value="all">
                  {/* This was previously missing proper Tabs wrapping */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-black/40">
                        <TableRow>
                          <TableHead className="text-gold">Invoice ID</TableHead>
                          <TableHead className="text-gold">Customer</TableHead>
                          <TableHead className="text-gold">Service Package</TableHead>
                          <TableHead className="text-gold text-right">Amount</TableHead>
                          <TableHead className="text-gold">Due Date</TableHead>
                          <TableHead className="text-gold">Status</TableHead>
                          <TableHead className="text-gold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="border-gold/10 hover:bg-white/5">
                            <TableCell className="font-medium text-white">{invoice.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-white">{invoice.customerName}</p>
                                <p className="text-white/50 text-sm">{invoice.customerEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">{invoice.servicePackage}</TableCell>
                            <TableCell className="text-right text-white font-medium">
                              {formatCurrency(invoice.amount)}
                            </TableCell>
                            <TableCell className="text-white/70">{invoice.dueDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  invoice.status === "paid" ? "outline" :
                                  invoice.status === "pending" ? "outline" :
                                  "destructive"
                                }
                                className={
                                  invoice.status === "paid" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                  invoice.status === "pending" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                  "bg-red-500/20 text-red-400"
                                }
                              >
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="text-white hover:bg-gold/20 h-8 w-8">
                                  <Eye size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-gold/20 h-8 w-8">
                                  <Send size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {filteredInvoices.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-white/60">
                              No invoices found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
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
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceReport;
