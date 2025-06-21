
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { DatabaseInvoice, CompanyDetails } from "./types";
import { generateInvoicePDF } from "@/utils/invoicePDFGenerator";
import InvoiceExpandedView from "./InvoiceExpandedView";

interface InvoiceCardProps {
  invoice: DatabaseInvoice;
  companyDetails: CompanyDetails | null;
  onMarkAsPaid: (invoiceId: string, customerName: string) => Promise<void>;
}

const InvoiceCard = ({ invoice, companyDetails, onMarkAsPaid }: InvoiceCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleGeneratePDF = async () => {
    if (companyDetails) {
      await generateInvoicePDF(invoice, companyDetails);
    }
  };

  const handleMarkAsPaid = () => {
    onMarkAsPaid(invoice.id, invoice.customer_name);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="font-semibold text-white">{invoice.reference_id}</h3>
              <Badge variant={invoice.paid ? "default" : isOverdue(invoice.due_date) ? "destructive" : "secondary"}>
                {invoice.paid ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </>
                ) : isOverdue(invoice.due_date) ? (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
              <div>
                <p className="font-medium text-white">{invoice.customer_name}</p>
                {invoice.customer_email && <p>{invoice.customer_email}</p>}
              </div>
              <div>
                <p>Issue: {new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p>Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-white">£{invoice.total.toFixed(2)}</p>
                {invoice.paid && invoice.payment_date && (
                  <p>Paid: {new Date(invoice.payment_date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button
              onClick={() => setExpanded(!expanded)}
              size="sm"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleGeneratePDF}
              size="sm"
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
            </Button>
            {!invoice.paid && (
              <Button
                onClick={handleMarkAsPaid}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark Paid
              </Button>
            )}
          </div>
        </div>

        {expanded && <InvoiceExpandedView invoice={invoice} />}
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
