"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Archive, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Étudiants", href: "/students" },
  { icon: Archive, label: "Archive", href: "/archive" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-container-low border-t border-outline-variant/10 backdrop-blur-lg pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 relative group",
                isActive ? "text-primary" : "text-on-surface-variant/60 hover:text-on-surface-variant"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-2xl transition-all duration-300",
                isActive ? "bg-primary-container text-primary" : "group-hover:bg-surface-container-high"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight",
                isActive ? "text-primary" : "opacity-60"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
