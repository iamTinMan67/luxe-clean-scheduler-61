-- Fix remaining security issues
-- Fix search path for functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (
    new.id,
    CASE 
      WHEN EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin' LIMIT 1) THEN 'customer'
      ELSE 'admin'
    END
  );
  RETURN new;
END;
$$;

-- Enable RLS on remaining tables that need it
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.van_inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_custom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.z_staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;