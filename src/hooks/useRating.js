import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRating(orderId) {
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if this order has already been rated
  useEffect(() => {
    if (!orderId) {
      setCheckingStatus(false);
      return;
    }

    const checkExistingRating = async () => {
      setCheckingStatus(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id')
          .eq('order_id', orderId)
          .limit(1);

        if (!error && data && data.length > 0) {
          setHasRated(true);
        }
      } catch (err) {
        console.error('Failed to check existing rating:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkExistingRating();
  }, [orderId]);

  const submitRating = async (rating, feedback = '') => {
    if (!orderId) throw new Error('No order to rate');

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          user_id: user?.id || null,
          rating,
          feedback: feedback.trim() || null,
        });

      if (error) throw error;

      setHasRated(true);
      return { success: true };
    } catch (err) {
      console.error('Failed to submit rating:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { hasRated, isSubmitting, checkingStatus, submitRating };
}
