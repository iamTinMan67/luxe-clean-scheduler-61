
-- First, let's check if we need to add any missing columns to the bookings table
-- Add travel_minutes column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS travel_minutes integer DEFAULT 15;

-- Add client_type column if it doesn't exist  
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS client_type text;

-- Add job_type column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS job_type text;

-- Add vehicle_reg column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS vehicle_reg text;

-- Add second_vehicle column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS second_vehicle text;

-- Add second_vehicle_reg column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS second_vehicle_reg text;

-- Add job_details column if it doesn't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS job_details text;

-- Ensure the bookings table can store all the data we need
-- Update the existing bookings table to match our Booking interface
ALTER TABLE bookings 
ALTER COLUMN customer_name SET NOT NULL,
ALTER COLUMN package_type SET NOT NULL,
ALTER COLUMN vehicle_type SET NOT NULL,
ALTER COLUMN location SET NOT NULL,
ALTER COLUMN time SET NOT NULL,
ALTER COLUMN date SET NOT NULL,
ALTER COLUMN status SET NOT NULL;

-- Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create an index on date for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
