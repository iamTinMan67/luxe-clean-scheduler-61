
import { toast } from "sonner";
import { generatePDFFromElement } from "@/utils/pdfUtils";
import { DatabaseInvoice, CompanyDetails } from "@/components/invoices/types";

export const generateInvoicePDF = async (invoice: DatabaseInvoice, companyDetails: CompanyDetails) => {
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
