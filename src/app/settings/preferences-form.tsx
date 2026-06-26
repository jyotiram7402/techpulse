"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/providers/supabase-provider";

interface CatOption {
  slug: string;
  label: string;
  emoji: string;
}

export function PreferencesForm({
  categories,
  initialSelected
}: {
  categories: CatOption[];
  initialSelected: string[];
}) {
  const { supabase, session } = useSupabase();
  const [selected, setSelected] = React.useState<Set<string>>(new Set(initialSelected));
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function toggle(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelected(next);
    setSaved(false);
  }

  async function save() {
    if (!session) return;
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: session.user.id,
          preferences: { categories: Array.from(selected) },
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (!error) setSaved(true);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {categories.map((c) => {
          const active = selected.has(c.slug);
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => toggle(c.slug)}
              className={cn(
                "relative flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all",
                active
                  ? "border-brand/40 bg-brand/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <span className="text-base">{c.emoji}</span>
              {c.label}
              {active ? <Check className="absolute right-2 top-2 h-3 w-3 text-brand" /> : null}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} variant="brand" size="sm">
          {saving ? "Saving…" : "Save preferences"}
        </Button>
        {saved ? <span className="text-xs text-brand">Saved ✓</span> : null}
      </div>
    </div>
  );
}
