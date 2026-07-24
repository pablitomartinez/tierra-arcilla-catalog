import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  //true si hay usuario
  const isAdmin = !!user; 

  useEffect(() => {
    let mounted = true;

    const applySession = async (currentSession: Session | null) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    // Escuchamos cambios en la sesión (login, logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        void applySession(session);
      }
    );

    // Obtenemos la sesión inicial al cargar la app
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