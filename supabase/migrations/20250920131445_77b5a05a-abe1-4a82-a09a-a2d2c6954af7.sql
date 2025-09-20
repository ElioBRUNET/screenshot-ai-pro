-- Fix security vulnerability: Enable RLS on activities table and restrict access to user's own data

-- First, let's make sure user_id is not nullable for security
-- Update any existing records without user_id to have a placeholder (they'll need to be cleaned up manually)
UPDATE public.activities 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Make user_id non-nullable (only if it's currently nullable)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE public.activities ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Add foreign key reference to auth.users for data integrity (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'activities_user_id_fkey'
    ) THEN
        ALTER TABLE public.activities 
        ADD CONSTRAINT activities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.activities;

-- Create policy: Users can only view their own activities
CREATE POLICY "Users can view their own activities" 
ON public.activities 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy: Users can only insert their own activities
CREATE POLICY "Users can insert their own activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can only update their own activities
CREATE POLICY "Users can update their own activities" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy: Users can only delete their own activities
CREATE POLICY "Users can delete their own activities" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = user_id);