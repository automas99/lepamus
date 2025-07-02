'use client';

import { useEffect } from 'react';
import supabase from '../../lib/supabaseClient';
import useStore from '../../store/useStore';

export default function UserProvider({ children }) {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    }
    fetchUser();

    // Optional: subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);

  return children;
}
