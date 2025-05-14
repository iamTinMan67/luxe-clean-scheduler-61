
import { useState } from "react";

export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  servicePackage: string;
  assignedStaff?: string;
}

export const useInvoiceReport = () => {
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

  // Calculate totals for financial summary
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

  return {
    invoices,
    filteredInvoices,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedStaff,
    setSelectedStaff,
    totals,
    formatCurrency,
    assignStaff
  };
};
