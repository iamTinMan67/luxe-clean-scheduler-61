
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const InvoiceSummary = () => {
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0
  });

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('paid, due_date, total');

      if (error) throw error;

      const now = new Date();
      const stats = invoices?.reduce((acc, invoice) => {
        const isOverdue = !invoice.paid && new Date(invoice.due_date) < now;
        
        acc.totalAmount += invoice.total;
        acc.total += 1;

        if (invoice.paid) {
          acc.paid += 1;
          acc.paidAmount += invoice.total;
        } else if (isOverdue) {
          acc.overdue += 1;
          acc.overdueAmount += invoice.total;
        } else {
          acc.pending += 1;
          acc.pendingAmount += invoice.total;
        }

        return acc;
      }, {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0
      }) || summary;

      setSummary(stats);
    } catch (error) {
      console.error('Error loading invoice summary:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-black/40 border-gold/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-white">{summary.total}</p>
              <p className="text-sm text-gold">£{summary.totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gold" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Paid</p>
              <p className="text-2xl font-bold text-white">{summary.paid}</p>
              <p className="text-sm text-green-500">£{summary.paidAmount.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">{summary.pending}</p>
              <p className="text-sm text-yellow-500">£{summary.pendingAmount.toFixed(2)}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-white">{summary.overdue}</p>
              <p className="text-sm text-red-500">£{summary.overdueAmount.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummary;
