import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [state, setState] = useState<{
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
  }>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  });

  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          if (mounted) {
            setState({
              user: session.user,
              session,
              loading: false,
              isAdmin,
            });
          }
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false,
          });
        }
      } catch {
        if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          if (mounted) {
            setState({
              user: session.user,
              session,
              loading: false,
              isAdmin,
            });
          }
        } else {
          setState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
    });
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAdmin: state.isAdmin,
    signOut,
  };
};
