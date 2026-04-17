"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Users, CreditCard, GraduationCap, Settings, LogOut, Archive } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Students",
    icon: Users,
    href: "/students",
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "#",
  },
  {
    label: "Archive",
    icon: Archive,
    href: "/archive",
  },
  {
    label: "Resources",
    icon: GraduationCap,
    href: "#",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className={cn("flex flex-col h-full bg-sidebar text-on-surface select-none", className)}>
      <div className="px-7 py-12 flex flex-col items-start gap-2">
        <div className="flex flex-col mb-16">
          <h1 className="text-base font-bold tracking-tight font-manrope text-primary uppercase leading-tight">
            Soutien Scolaire
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-[0.3em] uppercase opacity-40 mt-1">
            Academic Atelier
          </p>
        </div>
        
        <ScrollArea className="flex-1 w-full -mx-4 px-4">
          <div className="space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  className={cn(
                    "group flex p-3.5 w-full justify-start font-semibold cursor-pointer rounded-xl transition-all duration-200 font-inter text-sm",
                    isActive 
                      ? "bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.03)]" 
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3 transition-colors", isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface")} />
                    {route.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-auto px-6 py-8">
        <button
          onClick={handleLogout}
          className="group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200 font-inter text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}
