
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, FileText } from "lucide-react";
import { Invoice } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface InvoiceListProps {
  invoices: Invoice[];
  onMarkAsPaid: (id: string) => void;
  onViewPDF?: (id: string) => void;
  hideInvoiceIds?: boolean;
  showCustomerName?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ 
  invoices, 
  onMarkAsPaid,
  onViewPDF,
  hideInvoiceIds = false,
  showCustomerName = false
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800">
            {!hideInvoiceIds && (
              <TableHead className="text-gold">Invoice #</TableHead>
            )}
            {showCustomerName && (
              <TableHead className="text-gold">Customer</TableHead>
            )}
            <TableHead className="text-gold">Date</TableHead>
            <TableHead className="text-gold text-right">Amount</TableHead>
            <TableHead className="text-gold">Status</TableHead>
            <TableHead className="text-gold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow className="border-gray-800">
              <TableCell colSpan={hideInvoiceIds ? 5 : 6} className="text-center text-gray-400">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map(invoice => (
              <TableRow key={invoice.id} className="border-gray-800" id={`invoice-${invoice.id}`}>
                {!hideInvoiceIds && (
                  <TableCell className="text-white">{invoice.id}</TableCell>
                )}
                {showCustomerName && (
                  <TableCell className="text-white">
                    {invoice.customerId || "Customer"}
                  </TableCell>
                )}
                <TableCell className="text-white">
                  {format(new Date(invoice.date), 'PP')}
                </TableCell>
                <TableCell className="text-right font-medium text-white">
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={invoice.paid ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}
                  >
                    {invoice.paid ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {!invoice.paid ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                      onClick={() => onMarkAsPaid(invoice.id)}
                    >
                      <Check size={16} className="mr-1" /> 
                      Mark Paid
                    </Button>
                  ) : onViewPDF && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      onClick={() => onViewPDF(invoice.id)}
                    >
                      <FileText size={16} className="mr-1" />
                      View PDF
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceList;
