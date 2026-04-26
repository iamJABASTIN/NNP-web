-- Track when the guest downloaded/shared the bill PDF (Timer 1: 1.5hr expiry)
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS bill_requested_at TIMESTAMPTZ DEFAULT NULL;

-- Track when items were last added (Timer 2: 3hr inactivity expiry)
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
