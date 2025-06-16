
-- Create a table for storing company details
CREATE TABLE public.company_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'Premium Valet Services',
  address TEXT NOT NULL DEFAULT '123 Business Street, City, County, Postcode',
  phone TEXT NOT NULL DEFAULT '+44 1234 567890',
  email TEXT NOT NULL DEFAULT 'info@premiumvalet.co.uk',
  website TEXT DEFAULT 'www.premiumvalet.co.uk',
  vat_number TEXT DEFAULT 'GB123456789',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default company details
INSERT INTO public.company_details (company_name, address, phone, email, website, vat_number)
VALUES (
  'Premium Valet Services',
  '123 Business Street, City, County, Postcode',
  '+44 1234 567890',
  'info@premiumvalet.co.uk',
  'www.premiumvalet.co.uk',
  'GB123456789'
);

-- Update the existing invoices table to include reference_id and customer details
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS reference_id TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_reference_id ON public.invoices(reference_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON public.invoices(customer_name);

-- Create a trigger to automatically generate invoice reference when inserting
CREATE OR REPLACE FUNCTION generate_invoice_reference()
RETURNS TRIGGER AS $$
DECLARE
  year_count INTEGER;
BEGIN
  IF NEW.reference_id IS NULL THEN
    SELECT COUNT(*) + 1 INTO year_count
    FROM invoices 
    WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM NEW.issue_date);
    
    NEW.reference_id := 'INV-' || TO_CHAR(NEW.issue_date, 'YYYY') || '-' || LPAD(year_count::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_invoice_reference
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_reference();
