import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const resolveAdmin = async (currentSession: Session | null) => {
      if (!currentSession?.user) {
        if (mounted) setIsAdmin(false);
        return;
      }

      const { data: hasAdminRole, error } = await supabase.rpc("has_role", {
        _user_id: currentSession.user.id,
        _role: "admin",
      });

      if (mounted) setIsAdmin(!error && hasAdminRole === true);
    };

    const applySession = async (currentSession: Session | null) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await resolveAdmin(currentSession);

      if (mounted) setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        void applySession(session);
      },
    );

    void supabase.auth.getSession().then(({ data }) => applySession(data.session));

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, isAdmin, signIn, signOut };
}
