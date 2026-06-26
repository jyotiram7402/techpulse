"use client";

import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/providers/supabase-provider";

export function useBookmarkIds() {
  const { supabase, session } = useSupabase();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!session) {
        setIds(new Set());
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from("bookmarks")
        .select("article_id")
        .eq("user_id", session.user.id);
      if (cancelled) return;
      setIds(new Set((data ?? []).map((r) => r.article_id)));
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, session]);

  const toggle = useCallback(
    async (articleId: string) => {
      if (!session) return false;
      if (ids.has(articleId)) {
        const next = new Set(ids);
        next.delete(articleId);
        setIds(next);
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", session.user.id)
          .eq("article_id", articleId);
        return false;
      } else {
        const next = new Set(ids);
        next.add(articleId);
        setIds(next);
        await supabase
          .from("bookmarks")
          .insert({ user_id: session.user.id, article_id: articleId });
        return true;
      }
    },
    [ids, session, supabase]
  );

  return { ids, loading, toggle, isAuthenticated: !!session };
}
