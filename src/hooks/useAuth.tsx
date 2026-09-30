import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const checkAdminStatus = async (userId: string): Promise<boolean> => {
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
    };

    const handleSession = async (session: Session | null) => {
      if (!mountedRef.current) return;

      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        if (mountedRef.current) {
          setState({
            user: session.user,
            session,
            loading: false,
            isAdmin,
          });
        }
      } else {
        if (mountedRef.current) {
          setState({
            user: null,
            session: null,
            loading: false,
            isAdmin: false,
          });
        }
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (mountedRef.current) {
      setState({
        user: null,
        session: null,
        loading: false,
        isAdmin: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        session: state.session,
        loading: state.loading,
        isAdmin: state.isAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
