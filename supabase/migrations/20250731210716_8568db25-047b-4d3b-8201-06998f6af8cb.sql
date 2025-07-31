-- Security fixes for RLS policies
-- First, fix customer_feedback permissions

-- Add INSERT policy for customer feedback
CREATE POLICY "Users can submit feedback" 
ON public.customer_feedback 
FOR INSERT 
WITH CHECK (true);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Update customer_feedback to restrict reading to admins only
DROP POLICY IF EXISTS "Allow anyone to read feedback" ON public.customer_feedback;
CREATE POLICY "Only admins can read feedback" 
ON public.customer_feedback 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Allow users to update their own profile but not role (unless admin)
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (public.get_current_user_role() = 'admin' OR role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
);