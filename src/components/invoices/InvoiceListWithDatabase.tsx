import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generatePDFFromElement } from "@/utils/pdfUtils";
import { useFeedbackTrigger } from "@/hooks/invoices/useFeedbackTrigger";

interface DatabaseInvoice {
  id: string;
  reference_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
  payment_date: string | null;
  booking_id: string;
  items?: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface CompanyDetails {
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  vat_number: string;
}

interface InvoiceListProps {
  onInvoiceUpdate?: () => void;
}

const InvoiceListWithDatabase = ({ onInvoiceUpdate }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<DatabaseInvoice[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  // Initialize feedback trigger
  useFeedbackTrigger();

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

  const markAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          paid: true, 
          payment_date: new Date().toISOString() 
        })
        .eq('id', invoiceId);

      if (error) throw error;

      // Find the invoice for feedback URL
      const invoice = invoices.find(inv => inv.id === invoiceId);
      
      toast.success("Invoice marked as paid", {
        description: `Payment has been recorded successfully${invoice ? ` for ${invoice.customer_name}` : ''}`,
        action: invoice ? {
          label: "Copy Feedback Link",
          onClick: () => {
            const feedbackUrl = `${window.location.origin}/feedback?invoice=${invoice.id}`;
            navigator.clipboard.writeText(feedbackUrl);
            toast.success("Feedback link copied to clipboard");
          }
        } : undefined,
        duration: 8000
      });

      loadInvoices();
      onInvoiceUpdate?.();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error("Failed to update invoice");
    }
  };

  const generateInvoicePDF = async (invoice: DatabaseInvoice) => {
    if (!companyDetails) {
      toast.error("Company details not available");
      return;
    }

    // Create a temporary div for the invoice content
    const invoiceContent = document.createElement('div');
    invoiceContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: black;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">${companyDetails.company_name}</h1>
            <p style="margin: 5px 0; line-height: 1.5;">${companyDetails.address}</p>
            <p style="margin: 5px 0;">Phone: ${companyDetails.phone}</p>
            <p style="margin: 5px 0;">Email: ${companyDetails.email}</p>
            ${companyDetails.website ? `<p style="margin: 5px 0;">Website: ${companyDetails.website}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 24px; color: #333;">INVOICE</h2>
            <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">${invoice.reference_id}</p>
            <p style="margin: 5px 0;">Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p style="margin: 5px 0;">Due Date: ${new Date(invoice.due_date).toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Customer Details -->
        <div style="margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #D4AF37;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Bill To:</h3>
          <p style="margin: 2px 0; font-weight: bold;">${invoice.customer_name}</p>
          ${invoice.customer_email ? `<p style="margin: 2px 0;">${invoice.customer_email}</p>` : ''}
          ${invoice.customer_phone ? `<p style="margin: 2px 0;">${invoice.customer_phone}</p>` : ''}
        </div>

        <!-- Invoice Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #D4AF37; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd; width: 80px;">Qty</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 100px;">Unit Price</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 100px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map(item => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">£${item.unit_price.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">£${item.total.toFixed(2)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="margin-left: auto; width: 300px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <span>Subtotal:</span>
            <span>£${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;">
            <span>VAT (20%):</span>
            <span>£${invoice.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-weight: bold; font-size: 18px; color: #D4AF37; border-top: 2px solid #D4AF37;">
            <span>Total:</span>
            <span>£${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">${companyDetails.company_name}</p>
          ${companyDetails.vat_number ? `<p style="margin: 5px 0;">VAT Number: ${companyDetails.vat_number}</p>` : ''}
          <p style="margin: 5px 0;">Payment due within 14 days of invoice date</p>
        </div>
      </div>
    `;

    // Add to DOM temporarily
    document.body.appendChild(invoiceContent);

    try {
      await generatePDFFromElement(invoiceContent.id, `invoice-${invoice.reference_id}`);
    } finally {
      // Clean up
      document.body.removeChild(invoiceContent);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-4">
      {invoices.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">No invoices found</p>
          </CardContent>
        </Card>
      ) : (
        invoices.map((invoice) => (
          <Card key={invoice.id} className="bg-gray-900 border-gray-800">
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
                    onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => generateInvoicePDF(invoice)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {!invoice.paid && (
                    <Button
                      onClick={() => markAsPaid(invoice.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>

              {expandedInvoice === invoice.id && (
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
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

export default InvoiceListWithDatabase;
