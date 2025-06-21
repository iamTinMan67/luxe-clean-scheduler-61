
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatabaseInvoice, CompanyDetails } from "@/components/invoices/types";

export const useInvoiceDatabase = () => {
  const [invoices, setInvoices] = useState<DatabaseInvoice[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
    loadCompanyDetails();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data: invoicesData, error } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (
            id,
            description,
            quantity,
            unit_price,
            total
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedInvoices = invoicesData?.map(invoice => ({
        ...invoice,
        items: invoice.invoice_items || []
      })) || [];

      setInvoices(processedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('company_details')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setCompanyDetails(data);
    } catch (error) {
      console.error('Error loading company details:', error);
    }
  };

  const markAsPaid = async (invoiceId: string, customerName: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          paid: true, 
          payment_date: new Date().toISOString() 
        })
        .eq('id', invoiceId);

      if (error) throw error;

      toast.success("Invoice marked as paid", {
        description: `Payment has been recorded successfully for ${customerName}`,
        action: {
          label: "Copy Feedback Link",
          onClick: () => {
            const feedbackUrl = `${window.location.origin}/feedback?invoice=${invoiceId}`;
            navigator.clipboard.writeText(feedbackUrl);
            toast.success("Feedback link copied to clipboard");
          }
        },
        duration: 8000
      });

      loadInvoices();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error("Failed to update invoice");
    }
  };

  return {
    invoices,
    companyDetails,
    loading,
    loadInvoices,
    markAsPaid
  };
};
