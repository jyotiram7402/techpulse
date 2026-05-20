"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithPassword } from "@/actions/auth";

export function RegisterForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  async function action(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signUpWithPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm">
        <p className="font-medium text-brand">Check your inbox</p>
        <p className="mt-1 text-muted-foreground">
          We sent a confirmation link to verify your email. Click it to finish signing up.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
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
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="brand" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
