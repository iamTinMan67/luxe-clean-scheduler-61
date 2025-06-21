
import React from "react";
import { DatabaseInvoice } from "./types";

interface InvoiceExpandedViewProps {
  invoice: DatabaseInvoice;
}

const InvoiceExpandedView = ({ invoice }: InvoiceExpandedViewProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <h4 className="font-medium text-white mb-2">Invoice Items:</h4>
      <div className="space-y-2">
        {invoice.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-300">{item.description} (×{item.quantity})</span>
            <span className="text-white">£{item.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700 text-right">
        <div className="text-sm text-gray-400">
          <div>Subtotal: £{invoice.subtotal.toFixed(2)}</div>
          <div>VAT: £{invoice.tax.toFixed(2)}</div>
          <div className="font-bold text-white">Total: £{invoice.total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceExpandedView;
