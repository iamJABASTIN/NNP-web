import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSession() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial auth check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await validateSession(session.user);
      }

      setLoading(false);
    });

    // 2. Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await validateSession(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateSession = async (user) => {
    // Only validate anonymous users
    if (user.app_metadata?.provider !== 'anonymous') return;

    try {
      // Check if user is linked to an active table session
      const { data: sessionMember, error } = await supabase
        .from('session_members')
        .select('table_sessions(status)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      const isActive = sessionMember?.table_sessions?.status === 'active';

      if (!isActive) {
        // If not in an active session, check for 24h expiry
        const createdAt = new Date(user.created_at).getTime();
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - createdAt > twentyFourHours) {
          console.log('Anonymous session expired (24h), signing out...');
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      console.error('Session validation failed:', err);
    }
  };

  // Check-in (Anonymous Login)
  const checkIn = async (nickname, mobile = null) => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: { display_name: nickname, mobile_number: mobile } }
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required to start a session.');

    // 1. Create the session
    const { data: sessionData, error: sessionErr } = await supabase
      .from('table_sessions')
      .insert({ 
        table_id: tableId, 
        restaurant_id: restaurantId, 
        host_user_id: user.id 
      })
      .select()
      .single();

    if (sessionErr) throw sessionErr;

    // 2. Automatically add host as the first member
    const { error: memberErr } = await supabase
      .from('session_members')
      .insert({ 
        session_id: sessionData.id, 
        user_id: user.id,
        display_name: user.user_metadata?.display_name || 'Host'
      });

    if (memberErr) {
      console.error('Failed to add host to session members:', memberErr);
      // We don't throw here to avoid blocking the user if membership insertion fails
      // but the session header succeeded, although RLS will be tight.
    }

    return sessionData;
  };

  return { user, session, loading, checkIn, joinSession, startSession };
}
