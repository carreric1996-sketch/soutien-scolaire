import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { User, Shield, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Profile Settings — Soutien Scolaire",
  description: "Manage your teacher profile, center name, and contact details.",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  // Auth guard
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Try to fetch an existing profile row
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, center_name, phone")
    .eq("id", user.id)
    .single();

  // Fallbacks: profile DB → Google OAuth metadata → email prefix
  const defaultFullName =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "";
  const defaultCenterName = profile?.center_name ?? "";
  const defaultPhone = profile?.phone ?? "";

  // Derive initials for avatar
  const initials = defaultFullName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-10 max-w-2xl">
      {/* Page header */}
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant/50 mb-2">
          Account
        </p>
        <h1 className="text-4xl font-bold font-manrope text-primary">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant/70 font-medium">
          Your details are used to personalise WhatsApp reminders and your dashboard.
        </p>
      </div>

      {/* Identity card */}
      <Card className="border-none bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] px-10 py-10 text-white shadow-premium relative overflow-hidden flex items-center gap-8">
        <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
          {initials ? (
            <span className="text-3xl font-bold tracking-tight">{initials}</span>
          ) : (
            <User className="h-9 w-9 opacity-60" />
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 mb-1">
            Signed in as
          </p>
          <h2 className="text-2xl font-bold font-manrope leading-tight">
            {defaultFullName || "Teacher"}
          </h2>
          <p className="text-white/60 text-xs font-medium mt-1">{user.email}</p>
        </div>
        <Sparkles className="absolute -right-6 -bottom-6 h-48 w-48 text-white opacity-[0.04] rotate-12" />
      </Card>

      {/* Form card */}
      <Card className="border-none bg-white shadow-sm p-10">
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-surface-container-low">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">Teacher Profile</p>
            <p className="text-[11px] text-on-surface-variant/50 font-medium">
              Stored securely — only visible to you.
            </p>
          </div>
        </div>

        <ProfileForm
          userId={user.id}
          initialFullName={defaultFullName}
          initialCenterName={defaultCenterName}
          initialPhone={defaultPhone}
        />
      </Card>
    </div>
  );
}
