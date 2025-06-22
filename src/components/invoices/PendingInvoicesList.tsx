
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User } from "lucide-react";
import { DatabaseInvoice } from "./types";

interface PendingInvoicesListProps {
  invoices: DatabaseInvoice[];
  loading: boolean;
}

const PendingInvoicesList = ({ invoices, loading }: PendingInvoicesListProps) => {
  const pendingInvoices = invoices.filter(invoice => !invoice.paid);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Pending Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-400">Loading pending invoices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingInvoices.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Pending Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-400">No pending invoices found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          Pending Invoices ({pendingInvoices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-medium">{invoice.customer_name}</span>
                </div>
                <Badge variant="destructive" className="bg-red-600">
                  Unpaid
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <span>Invoice: {invoice.reference_id}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-medium">
                  <DollarSign className="w-3 h-3" />
                  <span>£{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingInvoicesList;
