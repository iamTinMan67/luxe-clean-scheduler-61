-- Security Fix 1: Enable proper RLS on customer_feedback table
-- Allow users to submit feedback but restrict access to their own feedback only

-- First, allow users to insert their own feedback
CREATE POLICY "Users can submit feedback" 
ON public.customer_feedback 
FOR INSERT 
WITH CHECK (true); -- Anyone can submit feedback

-- Allow users to view only their own feedback (for authenticated users)
DROP POLICY IF EXISTS "Allow anyone to read feedback" ON public.customer_feedback;
CREATE POLICY "Users can view own feedback" 
ON public.customer_feedback 
FOR SELECT 
USING (auth.uid()::text IN (
  SELECT id::text FROM bookings WHERE customer_email = customer_feedback.email
) OR auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Security Fix 2: Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Security Fix 3: Secure profiles table with proper RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile BUT protect role field
CREATE POLICY "Users can update own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND 
  (
    -- Either the role hasn't changed
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = NEW.role
    OR 
    -- Or the user is an admin
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  )
);

-- Security Fix 4: Tighten bookings table policies
DROP POLICY IF EXISTS "Allow all operations for now" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to read all bookings" ON public.bookings;

-- Admins can do everything
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings" 
ON public.bookings 
FOR SELECT 
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
       OR public.get_current_user_role() = 'admin');

-- Anyone can create bookings (for public booking form)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Security Fix 5: Secure invoices table
DROP POLICY IF EXISTS "Allow all operations for now" ON public.invoices;
DROP POLICY IF EXISTS "Allow authenticated users to read all invoices" ON public.invoices;

CREATE POLICY "Admins can manage all invoices" 
ON public.invoices 
FOR ALL 
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Customers can view own invoices" 
ON public.invoices 
FOR SELECT 
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
       OR public.get_current_user_role() = 'admin');