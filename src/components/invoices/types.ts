
export interface DatabaseInvoice {
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

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface CompanyDetails {
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  vat_number: string;
}

export interface InvoiceListProps {
  onInvoiceUpdate?: () => void;
}
