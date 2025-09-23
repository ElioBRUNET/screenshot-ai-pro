-- Create RLS policies for daily_recommendations table
CREATE POLICY "Users can view their own daily recommendations" 
ON public.daily_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily recommendations" 
ON public.daily_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily recommendations" 
ON public.daily_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily recommendations" 
ON public.daily_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);