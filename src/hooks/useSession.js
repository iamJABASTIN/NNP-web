import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSession() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check-in (Anonymous Login)
  const checkIn = async (nickname) => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: { display_name: nickname } }
      });
      if (error) throw error;
      return data.user;
    } catch (err) {
      console.error('Error signing in anonymously:', err);
      throw err;
    }
  };

  // Session Joining Logic
  const joinSession = async (tableId, sessionCode) => {
    // 1. Verify session code and table
    const { data: sessionData, error } = await supabase
      .from('table_sessions')
      .select('*')
      .eq('table_id', tableId)
      .eq('session_code', sessionCode.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error || !sessionData) throw new Error('Invalid code or no active session.');

    // 2. Join the session
    const { error: joinError } = await supabase
      .from('session_members')
      .insert({ session_id: sessionData.id, user_id: (await supabase.auth.getUser()).data.user.id });

    if (joinError) throw joinError;
    return sessionData;
  };

  // Start Session (Host)
  const startSession = async (tableId, restaurantId) => {
    const { data, error } = await supabase
      .from('table_sessions')
      .insert({ table_id: tableId, restaurant_id: restaurantId, host_user_id: (await supabase.auth.getUser()).data.user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { user, session, loading, checkIn, joinSession, startSession };
}
