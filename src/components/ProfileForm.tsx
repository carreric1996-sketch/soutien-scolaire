"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Building2, Phone, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ProfileFormProps {
  userId: string;
  initialFullName: string;
  initialCenterName: string;
  initialPhone: string;
}

export function ProfileForm({
  userId,
  initialFullName,
  initialCenterName,
  initialPhone,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [centerName, setCenterName] = useState(initialCenterName);
  const [phone, setPhone] = useState(initialPhone);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("profiles").upsert(
          {
            id: userId,
            full_name: fullName.trim(),
            center_name: centerName.trim(),
            phone: phone.trim(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (error) throw error;
        setStatus("success");

        // Auto-dismiss success state after 3s
        setTimeout(() => setStatus("idle"), 3000);
      } catch (err) {
        console.error("Error saving profile:", err);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="full-name"
          className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/70"
        >
          Full Name
        </label>
        <div className="relative group">
          <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            required
            className="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl text-sm font-semibold text-primary placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary/20 transition-all"
          />
        </div>
        <p className="text-[11px] text-on-surface-variant/50 pl-1">
          This name will appear in WhatsApp payment reminders.
        </p>
      </div>

      {/* Center Name */}
      <div className="space-y-2">
        <label
          htmlFor="center-name"
          className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/70"
        >
          Center / School Name
        </label>
        <div className="relative group">
          <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          <input
            id="center-name"
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            placeholder="e.g. Centre Éducatif Atlas"
            className="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl text-sm font-semibold text-primary placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary/20 transition-all"
          />
        </div>
        <p className="text-[11px] text-on-surface-variant/50 pl-1">
          Optional — displayed in message signatures.
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/70"
        >
          Phone Number
        </label>
        <div className="relative group">
          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6XX XXX XXX"
            className="w-full pl-12 pr-5 py-4 bg-surface-container-low rounded-2xl text-sm font-semibold text-primary placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Submit row */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest bg-primary text-white shadow-premium hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-3"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Saving…" : "Save Profile"}
        </Button>

        {/* Inline feedback */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-whatsapp animate-in fade-in slide-in-from-left-2 duration-300">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Saved!</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-500 animate-in fade-in slide-in-from-left-2 duration-300">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Error — try again.</span>
          </div>
        )}
      </div>
    </form>
  );
}
