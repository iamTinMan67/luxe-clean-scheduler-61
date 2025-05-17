
import { useState } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/lib/types";
import { Link } from "react-router-dom";
import { Download, Mail, MessageSquare, Star, Send } from "lucide-react";
import { toast } from "sonner";
import { sendTrackingInfo } from "@/utils/emailUtils";

interface InvoiceListProps {
  invoices: Invoice[];
  onMarkAsPaid: (invoiceId: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onMarkAsPaid }) => {
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
    // Only allow feedback requests for paid invoices
    if (!invoice.paid) {
      toast.error("Cannot request feedback", {
        description: "Feedback can only be requested for paid invoices."
      });
      return;
    }
    
    console.log(`Requesting feedback for invoice ${invoice.id}`);
    
    // Generate a feedback URL with the invoice ID (which is now the booking ID)
    const feedbackUrl = `/feedback/${invoice.id}`;
    
    // In a real app, this would send the feedback URL to the customer
    toast.success("Feedback request sent", {
      description: `A feedback request has been sent to the customer for booking #${invoice.id}.`
    });
  };

  // Function to send tracking link to customer
  const sendTrackingLink = async (invoice: Invoice) => {
    // Find the corresponding booking
    const confirmedBookingsStr = localStorage.getItem('confirmedBookings');
    if (!confirmedBookingsStr) {
      toast.error("Booking not found");
      return;
    }
    
    try {
      const confirmedBookings = JSON.parse(confirmedBookingsStr);
      const booking = confirmedBookings.find((b: any) => b.id === invoice.id);
      
      if (!booking) {
        toast.error("Booking not found");
        return;
      }
      
      // Send tracking info email
      await sendTrackingInfo(booking);
      
      toast.success("Tracking link sent", {
        description: `Tracking information has been sent to the customer.`
      });
    } catch (error) {
      console.error("Error sending tracking link:", error);
      toast.error("Failed to send tracking link");
    }
  };

  return (
    <>
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
                        className={invoice.paid ? "text-gray-400 hover:text-white" : "text-gray-600 cursor-not-allowed"}
                        onClick={() => requestFeedback(invoice)}
                        disabled={!invoice.paid}
                        title={invoice.paid ? "Request Feedback" : "Feedback requires payment"}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => sendTrackingLink(invoice)}
                        title="Send Tracking Link"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      {!invoice.paid && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 bg-green-900/30 text-green-400 border-green-700 hover:bg-green-800"
                          onClick={() => onMarkAsPaid(invoice.id)}
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
    </>
  );
};

export default InvoiceList;
