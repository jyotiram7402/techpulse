"use client";

import * as React from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

interface SupabaseContextValue {
  supabase: SupabaseClient<Database>;
  session: Session | null;
}

const SupabaseContext = React.createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({
  children,
  initialSession
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [supabase] = React.useState(() => createClient());
  const [session, setSession] = React.useState<Session | null>(initialSession);

  React.useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = React.useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used inside SupabaseProvider");
  return ctx;
}
