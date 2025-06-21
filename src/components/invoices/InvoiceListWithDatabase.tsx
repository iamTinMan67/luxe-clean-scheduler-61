
import React from "react";
import { useInvoiceDatabase } from "@/hooks/invoices/useInvoiceDatabase";
import { useFeedbackTrigger } from "@/hooks/invoices/useFeedbackTrigger";
import { InvoiceListProps } from "./types";
import InvoiceCard from "./InvoiceCard";
import EmptyInvoiceState from "./EmptyInvoiceState";

const InvoiceListWithDatabase = ({ onInvoiceUpdate }: InvoiceListProps) => {
  const { invoices, companyDetails, loading, markAsPaid } = useInvoiceDatabase();

  // Initialize feedback trigger
  useFeedbackTrigger();

  const handleMarkAsPaid = async (invoiceId: string, customerName: string) => {
    await markAsPaid(invoiceId, customerName);
    onInvoiceUpdate?.();
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <EmptyInvoiceState />
      ) : (
        invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            companyDetails={companyDetails}
            onMarkAsPaid={handleMarkAsPaid}
          />
        ))
      )}
    </div>
  );
};

export default InvoiceListWithDatabase;
