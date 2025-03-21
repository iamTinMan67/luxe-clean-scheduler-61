import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";
import { Link } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        // Parse the JSON and convert date strings to Date objects
        const parsedInvoices = JSON.parse(savedInvoices).map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date)
        }));
        setInvoices(parsedInvoices);
      } catch (error) {
        console.error('Error parsing invoices:', error);
      }
    }
  }, []);
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };
  
  // Function to send invoice via email
  const sendInvoiceEmail = (invoice: Invoice) => {
    // In a real app, this would connect to an email API
    console.log(`Sending invoice ${invoice.id} via email`);
    
    toast.success("Invoice sent via email", {
      description: `Invoice #${invoice.id} has been sent via email.`
    });
  };
  
  // Function to send invoice via SMS
  const sendInvoiceSMS = (invoice: Invoice) => {
    // In a real app, this would connect to an SMS API
    console.log(`Sending invoice ${invoice.id} via SMS`);
    
    toast.success("Invoice sent via SMS", {
      description: `Invoice #${invoice.id} has been sent via SMS.`
    });
  };
  
  // Function to download invoice as PDF
  const downloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate a PDF for download
    console.log(`Downloading invoice ${invoice.id}`);
    
    toast.success("Invoice download initiated", {
      description: `Your invoice #${invoice.id} is being prepared for download.`
    });
  };
  
  // Function to request customer feedback
  const requestFeedback = (invoice: Invoice) => {
    console.log(`Requesting feedback for invoice ${invoice.id}`);
    
    // Generate a feedback URL with the invoice ID (which is now the booking ID)
    const feedbackUrl = `/feedback/${invoice.id}`;
    
    // In a real app, this would send the feedback URL to the customer
    toast.success("Feedback request sent", {
      description: `A feedback request has been sent to the customer for booking #${invoice.id}.`
    });
  };
  
  // Function to mark invoice as paid
  const markAsPaid = (invoiceId: string) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, paid: true } : invoice
    );
    
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast.success("Invoice marked as paid", {
      description: `Invoice #${invoiceId} has been marked as paid.`
    });
  };

  return (
    <div className="min-h-screen bg-black pb-16">
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white">
              Customer <span className="text-gold">Invoices</span>
            </h1>
            <p className="text-gray-400">
              View and manage all customer invoices
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Invoices</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700">
                    {invoices.filter(inv => inv.paid).length} Paid
                  </Badge>
                  <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700">
                    {invoices.filter(inv => !inv.paid).length} Pending
                  </Badge>
                </div>
              </div>
              
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400">Booking/Invoice #</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id} className="border-gray-800">
                          <TableCell className="font-medium text-white">
                            <Link 
                              to={`/progress?invoiceId=${invoice.id}`} 
                              className="text-gold hover:underline hover:text-gold/80 transition-colors"
                            >
                              {invoice.id}
                            </Link>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {format(new Date(invoice.date), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-gold font-medium">{formatCurrency(invoice.total)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={invoice.paid 
                                ? "bg-green-900/30 text-green-400 border-green-700" 
                                : "bg-amber-900/30 text-amber-400 border-amber-700"}
                            >
                              {invoice.paid ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                                onClick={() => downloadInvoice(invoice)}
                                title="Download Invoice"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                                onClick={() => sendInvoiceEmail(invoice)}
                                title="Send via Email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                                onClick={() => sendInvoiceSMS(invoice)}
                                title="Send via SMS"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                                onClick={() => requestFeedback(invoice)}
                                title="Request Feedback"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              {!invoice.paid && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-800"
                                  onClick={() => markAsPaid(invoice.id)}
                                >
                                  Mark as Paid
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No invoices to display</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Invoices;
