
import { toast } from "sonner";
import { generatePDFFromElement } from "@/utils/pdfUtils";
import { DatabaseInvoice, CompanyDetails } from "@/components/invoices/types";
import { escapeHtml } from "@/utils/inputSanitizer";

export const generateInvoicePDF = async (invoice: DatabaseInvoice, companyDetails: CompanyDetails) => {
  if (!companyDetails) {
    toast.error("Company details not available");
    return;
  }

  // Create a temporary div for the invoice content using safe DOM manipulation
  const invoiceContent = document.createElement('div');
  invoiceContent.id = `invoice-${Date.now()}`;
  invoiceContent.style.cssText = 'font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: black;';

  // Create header section
  const header = document.createElement('div');
  header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 30px;';
  
  const companyInfo = document.createElement('div');
  const companyTitle = document.createElement('h1');
  companyTitle.style.cssText = 'color: #D4AF37; margin: 0; font-size: 28px;';
  companyTitle.textContent = companyDetails.company_name;
  companyInfo.appendChild(companyTitle);
  
  const addressP = document.createElement('p');
  addressP.style.cssText = 'margin: 5px 0; line-height: 1.5;';
  addressP.textContent = companyDetails.address;
  companyInfo.appendChild(addressP);
  
  const phoneP = document.createElement('p');
  phoneP.style.cssText = 'margin: 5px 0;';
  phoneP.textContent = `Phone: ${companyDetails.phone}`;
  companyInfo.appendChild(phoneP);
  
  const emailP = document.createElement('p');
  emailP.style.cssText = 'margin: 5px 0;';
  emailP.textContent = `Email: ${companyDetails.email}`;
  companyInfo.appendChild(emailP);
  
  if (companyDetails.website) {
    const websiteP = document.createElement('p');
    websiteP.style.cssText = 'margin: 5px 0;';
    websiteP.textContent = `Website: ${companyDetails.website}`;
    companyInfo.appendChild(websiteP);
  }
  
  const invoiceInfo = document.createElement('div');
  invoiceInfo.style.cssText = 'text-align: right;';
  
  const invoiceTitle = document.createElement('h2');
  invoiceTitle.style.cssText = 'margin: 0; font-size: 24px; color: #333;';
  invoiceTitle.textContent = 'INVOICE';
  invoiceInfo.appendChild(invoiceTitle);
  
  const refP = document.createElement('p');
  refP.style.cssText = 'margin: 5px 0; font-size: 16px; font-weight: bold;';
  refP.textContent = invoice.reference_id;
  invoiceInfo.appendChild(refP);
  
  const issueDateP = document.createElement('p');
  issueDateP.style.cssText = 'margin: 5px 0;';
  issueDateP.textContent = `Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}`;
  invoiceInfo.appendChild(issueDateP);
  
  const dueDateP = document.createElement('p');
  dueDateP.style.cssText = 'margin: 5px 0;';
  dueDateP.textContent = `Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`;
  invoiceInfo.appendChild(dueDateP);
  
  header.appendChild(companyInfo);
  header.appendChild(invoiceInfo);
  invoiceContent.appendChild(header);

  // Customer details section
  const customerSection = document.createElement('div');
  customerSection.style.cssText = 'margin-bottom: 30px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #D4AF37;';
  
  const billToH3 = document.createElement('h3');
  billToH3.style.cssText = 'margin: 0 0 10px 0; color: #333;';
  billToH3.textContent = 'Bill To:';
  customerSection.appendChild(billToH3);
  
  const customerName = document.createElement('p');
  customerName.style.cssText = 'margin: 2px 0; font-weight: bold;';
  customerName.textContent = invoice.customer_name;
  customerSection.appendChild(customerName);
  
  if (invoice.customer_email) {
    const customerEmail = document.createElement('p');
    customerEmail.style.cssText = 'margin: 2px 0;';
    customerEmail.textContent = invoice.customer_email;
    customerSection.appendChild(customerEmail);
  }
  
  if (invoice.customer_phone) {
    const customerPhone = document.createElement('p');
    customerPhone.style.cssText = 'margin: 2px 0;';
    customerPhone.textContent = invoice.customer_phone;
    customerSection.appendChild(customerPhone);
  }
  
  invoiceContent.appendChild(customerSection);

  // Items table - safely create table structure
  const table = document.createElement('table');
  table.style.cssText = 'width: 100%; border-collapse: collapse; margin-bottom: 30px;';
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.cssText = 'background-color: #D4AF37; color: white;';
  
  const headers = ['Description', 'Qty', 'Unit Price', 'Total'];
  const headerWidths = ['', 'width: 80px;', 'width: 100px;', 'width: 100px;'];
  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.style.cssText = `padding: 12px; text-align: ${index === 0 ? 'left' : index === 1 ? 'center' : 'right'}; border: 1px solid #ddd; ${headerWidths[index]}`;
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  
  invoice.items?.forEach(item => {
    const row = document.createElement('tr');
    
    const descCell = document.createElement('td');
    descCell.style.cssText = 'padding: 10px; border: 1px solid #ddd;';
    descCell.textContent = item.description;
    row.appendChild(descCell);
    
    const qtyCell = document.createElement('td');
    qtyCell.style.cssText = 'padding: 10px; border: 1px solid #ddd; text-align: center;';
    qtyCell.textContent = item.quantity.toString();
    row.appendChild(qtyCell);
    
    const priceCell = document.createElement('td');
    priceCell.style.cssText = 'padding: 10px; border: 1px solid #ddd; text-align: right;';
    priceCell.textContent = `£${item.unit_price.toFixed(2)}`;
    row.appendChild(priceCell);
    
    const totalCell = document.createElement('td');
    totalCell.style.cssText = 'padding: 10px; border: 1px solid #ddd; text-align: right;';
    totalCell.textContent = `£${item.total.toFixed(2)}`;
    row.appendChild(totalCell);
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  invoiceContent.appendChild(table);

  // Totals section
  const totalsDiv = document.createElement('div');
  totalsDiv.style.cssText = 'margin-left: auto; width: 300px;';
  
  const subtotalDiv = document.createElement('div');
  subtotalDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;';
  subtotalDiv.innerHTML = `<span>Subtotal:</span><span>£${invoice.subtotal.toFixed(2)}</span>`;
  totalsDiv.appendChild(subtotalDiv);
  
  const taxDiv = document.createElement('div');
  taxDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd;';
  taxDiv.innerHTML = `<span>VAT (20%):</span><span>£${invoice.tax.toFixed(2)}</span>`;
  totalsDiv.appendChild(taxDiv);
  
  const totalDiv = document.createElement('div');
  totalDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 12px 0; font-weight: bold; font-size: 18px; color: #D4AF37; border-top: 2px solid #D4AF37;';
  totalDiv.innerHTML = `<span>Total:</span><span>£${invoice.total.toFixed(2)}</span>`;
  totalsDiv.appendChild(totalDiv);
  
  invoiceContent.appendChild(totalsDiv);

  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = 'margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;';
  
  const footerCompany = document.createElement('p');
  footerCompany.style.cssText = 'margin: 5px 0;';
  footerCompany.textContent = companyDetails.company_name;
  footer.appendChild(footerCompany);
  
  if (companyDetails.vat_number) {
    const vatP = document.createElement('p');
    vatP.style.cssText = 'margin: 5px 0;';
    vatP.textContent = `VAT Number: ${companyDetails.vat_number}`;
    footer.appendChild(vatP);
  }
  
  const paymentP = document.createElement('p');
  paymentP.style.cssText = 'margin: 5px 0;';
  paymentP.textContent = 'Payment due within 14 days of invoice date';
  footer.appendChild(paymentP);
  
  invoiceContent.appendChild(footer);

  // Add to DOM temporarily
  document.body.appendChild(invoiceContent);

  try {
    await generatePDFFromElement(invoiceContent.id, `invoice-${invoice.reference_id}`);
  } finally {
    // Clean up
    document.body.removeChild(invoiceContent);
  }
};
