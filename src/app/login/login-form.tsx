"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword } from "@/actions/auth";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  // Submit via onSubmit, not <form action>: React 19 resets the form after an
  // action, which would clear the typed email when sign-in fails.
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signInWithPassword(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@dev.team"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="brand" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
