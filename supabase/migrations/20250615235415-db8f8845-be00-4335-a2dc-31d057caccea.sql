
-- Create bookings table (if not exists with all required columns)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS start_time text,
ADD COLUMN IF NOT EXISTS end_time text,
ADD COLUMN IF NOT EXISTS staff JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS condition integer DEFAULT 5;

-- Create table for service progress tracking
CREATE TABLE IF NOT EXISTS public.service_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for testimonials (separate from gallery items)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  text TEXT NOT NULL,
  image TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking progress
CREATE TABLE IF NOT EXISTS public.booking_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  progress_percentage INTEGER DEFAULT 0,
  current_step TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for van inventory items
CREATE TABLE IF NOT EXISTS public.van_inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  van_id UUID REFERENCES public.vans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'units',
  threshold INTEGER DEFAULT 5,
  last_restocked DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.service_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.van_inventory_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_progress (accessible to all authenticated users)
CREATE POLICY "Allow all operations on service_progress" 
  ON public.service_progress 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- RLS policies for testimonials (publicly readable, admin writable)
CREATE POLICY "Public can view testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage testimonials" 
  ON public.testimonials 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- RLS policies for booking_tracking (accessible to all authenticated users)
CREATE POLICY "Allow all operations on booking_tracking" 
  ON public.booking_tracking 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- RLS policies for van_inventory_items (accessible to all authenticated users)
CREATE POLICY "Allow all operations on van_inventory_items" 
  ON public.van_inventory_items 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Update existing tables to ensure they have proper structure
ALTER TABLE public.bookings 
ALTER COLUMN progress_percentage SET DEFAULT 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_progress_booking_id ON public.service_progress(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_tracking_booking_id ON public.booking_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_van_inventory_van_id ON public.van_inventory_items(van_id);
