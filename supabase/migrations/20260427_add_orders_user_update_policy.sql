-- Add missing UPDATE policy for orders table so users can update their own orders
-- This is required for stamping bill_requested_at and updating total_amount when adding items

CREATE POLICY "orders_user_update"
ON public.orders
FOR UPDATE
USING (
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM session_members 
    WHERE session_members.session_id = orders.session_id 
    AND session_members.user_id = auth.uid()
  ))
)
WITH CHECK (
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM session_members 
    WHERE session_members.session_id = orders.session_id 
    AND session_members.user_id = auth.uid()
  ))
);
