"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Users, CreditCard, GraduationCap, Settings, LogOut, Archive } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { BroadcastAction } from "./BroadcastAction";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";

const routes = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Étudiants",
    icon: Users,
    href: "/students",
  },
  {
    label: "Paiements",
    icon: CreditCard,
    href: "#",
  },
  {
    label: "Archives",
    icon: Archive,
    href: "/archive",
  },
  {
    label: "Ressources",
    icon: GraduationCap,
    href: "#",
  },
  {
    label: "Paramètres",
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
  const [data, setData] = useState<{ students: Student[]; teacherName: string; centerName?: string }>({
    students: [],
    teacherName: "Teacher",
  });

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: students }] = await Promise.all([
        supabase.from("profiles").select("full_name, center_name").eq("id", user.id).single(),
        supabase
          .from("students")
          .select("*")
          .eq("is_active", true)
          .eq("teacher_id", user.id),
      ]);

      setData({
        students: students || [],
        teacherName: profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Teacher",
        centerName: profile?.center_name,
      });
    }
    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className={cn("flex flex-col h-full w-56 bg-primary text-white select-none relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.15)_0%,transparent_80%)] pointer-events-none" />
      <div className="px-5 py-12 flex flex-col items-start gap-2 h-full relative z-10">
        <div className="flex flex-col mb-8 pb-8 border-b border-white/15 w-full">
          <h1 className="text-base font-bold tracking-tight font-manrope text-white uppercase leading-tight">
            Soutien Scolaire
          </h1>
          <p className="text-[10px] font-bold text-white/55 tracking-[0.3em] uppercase mt-1">
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
                    "group relative flex px-3 py-2 mx-3 justify-start font-semibold cursor-pointer rounded-xl transition-all duration-200 font-inter text-sm z-10 overflow-hidden",
                    isActive 
                      ? "bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
                      : "text-white/55 hover:text-white/90 hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#25D366]" />
                  )}
                  <div className="flex items-center flex-1">
                    <route.icon className={cn("h-5 w-5 mr-3 transition-colors", isActive ? "text-primary" : "text-white/55 group-hover:text-white/90")} />
                    {route.label}
                    {route.href === "#" && (
                      <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-on-surface-variant/30">Bientôt</span>
                    )}
                  </div>
                </Link>
              );
            })}
            <BroadcastAction 
              variant="sidebar-item" 
              students={data.students} 
              teacherName={data.teacherName} 
              centerName={data.centerName} 
            />
          </div>
        </ScrollArea>
      </div>

      <div className="mt-auto px-6 py-8 border-t border-white/15 relative z-10">
        <button
          onClick={handleLogout}
          className="group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200 font-inter text-sm text-red-300/60 hover:text-red-300 hover:bg-white/5"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-4 w-4 mr-3" />
            Se déconnecter
          </div>
        </button>
      </div>
    </div>
  );
}
