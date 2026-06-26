import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { CATEGORIES } from "@/lib/constants";
import { PreferencesForm } from "@/app/settings/preferences-form";

export const metadata = {
  title: "Settings",
  description: "Manage your account preferences."
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/settings");
  }

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("preferences")
    .eq("user_id", user.id)
    .maybeSingle();

  const initialCategories = (prefs?.preferences as { categories?: string[] } | null)?.categories ?? [];
  const initials = (user.email ?? "U")
    .split(/[@.]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container max-w-3xl space-y-6 py-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Customize your feed and manage your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>The email connected to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="shrink-0">
              <AvatarFallback className="bg-brand/15 text-brand">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.email}</div>
              <div className="text-xs text-muted-foreground">
                Member since {new Date(user.created_at).getFullYear()}
              </div>
            </div>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred categories</CardTitle>
          <CardDescription>
            Pick the topics you care most about. We&apos;ll use these in upcoming personalization features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-5" />
          <PreferencesForm
            categories={CATEGORIES.map((c) => ({ slug: c.slug, label: c.label, emoji: c.emoji }))}
            initialSelected={initialCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
