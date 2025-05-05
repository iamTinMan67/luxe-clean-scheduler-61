
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/lib/types";

interface InvoiceSummaryProps {
  invoices: Invoice[];
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoices }) => {
  const paidInvoices = invoices.filter(inv => inv.paid).length;
  const pendingInvoices = invoices.filter(inv => !inv.paid).length;
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700">
        {paidInvoices} Paid
      </Badge>
      <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700">
        {pendingInvoices} Pending
      </Badge>
    </div>
  );
};

export default InvoiceSummary;
