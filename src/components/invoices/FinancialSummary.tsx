
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface FinancialSummaryProps {
  totals: {
    all: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  formatCurrency: (amount: number) => string;
  invoices: any[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ totals, formatCurrency, invoices }) => {
  return (
    <Card className="bg-black/60 border-gold/30">
      <CardHeader>
        <CardTitle className="text-white">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="all">
          <TabsContent value="all" className="m-0">
            <div className="bg-black/40 p-4 rounded-md border border-gold/20">
              <p className="text-white/70 text-sm mb-1">Total Revenue</p>
              <p className="text-white text-2xl font-bold">{formatCurrency(totals.all)}</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Paid Invoices</p>
            <p className="text-green-500 text-2xl font-bold">{formatCurrency(totals.paid)}</p>
            <p className="text-white/50 text-xs mt-1">
              {invoices.filter(i => i.status === "paid").length} invoices
            </p>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Pending Invoices</p>
            <p className="text-amber-500 text-2xl font-bold">{formatCurrency(totals.pending)}</p>
            <p className="text-white/50 text-xs mt-1">
              {invoices.filter(i => i.status === "pending").length} invoices
            </p>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-gold/20">
            <p className="text-white/70 text-sm mb-1">Overdue Invoices</p>
            <p className="text-red-500 text-2xl font-bold">{formatCurrency(totals.overdue)}</p>
            <p className="text-white/50 text-xs mt-1">
              {invoices.filter(i => i.status === "overdue").length} invoices
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
