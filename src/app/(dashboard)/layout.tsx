"use client";

import { Sidebar } from "@/components/Sidebar";
import { Menu, User, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name =
        user?.user_metadata?.full_name ??
        user?.email?.split("@")[0] ??
        "Teacher";
      setFullName(name);
    });
  }, []);

  // Derive first name and initials for the avatar
  const firstName = fullName?.split(" ")[0] ?? "";
  const initials = fullName
    ? fullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex w-72 flex-col fixed inset-y-0 z-[80]" />

      <div className="flex-1 flex flex-col md:pl-72 h-full overflow-hidden">
        {/* Top Bar (Desktop) */}
        <header className="hidden md:flex items-center justify-end h-20 px-12 gap-6 bg-transparent">
          <NotificationBell />
          <Button variant="ghost" size="icon" className="text-on-surface-variant opacity-60">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 pl-6 ml-2 relative">
            <div className="text-right">
              <p className="text-xs font-bold text-primary">
                {firstName || "Teacher"}
              </p>
              <p className="text-[10px] text-on-surface-variant opacity-60 font-bold uppercase tracking-wider">
                Overview
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-surface-container flex items-center justify-center p-0.5 border-2 border-white shadow-sm overflow-hidden">
              <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                {initials ? (
                  <span className="text-[11px] font-bold text-primary">{initials}</span>
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-6 bg-white border-b border-surface-container">
          <Sheet inverse={false}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="text-primary" data-slot="sheet-trigger">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 border-none w-72">
              <Sidebar className="h-full" />
            </SheetContent>
          </Sheet>
          <h1 className="font-manrope font-bold text-sm text-primary uppercase tracking-wider">
            Soutien Scolaire
          </h1>
          <div className="h-8 w-8 rounded-full bg-surface-container flex items-center justify-center">
            {initials ? (
              <span className="text-[10px] font-bold text-primary">{initials}</span>
            ) : (
              <div className="h-8 w-8 rounded-full bg-surface-container" />
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 md:px-12 md:py-8 lg:px-16 lg:py-10">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
