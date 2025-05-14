
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";
import { Invoice } from "@/hooks/useInvoiceReport";

interface InvoiceTableProps {
  invoices: Invoice[];
  formatCurrency: (amount: number) => string;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, formatCurrency }) => {
  return (
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
          {invoices.map((invoice) => (
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
          
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-white/60">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
