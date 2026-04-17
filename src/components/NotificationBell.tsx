"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Bell, AlertTriangle, ArrowRight, X, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = useRef(createClient());

  const fetchUnpaidCount = useCallback(async (uid: string) => {
    try {
      // Use a more robust query: select all IDs and count them client-side to avoid issues with .select(id, {count...})
      const { data, error } = await supabase.current
        .from("students")
        .select("id")
        .eq("teacher_id", uid)
        .eq("status", "Unpaid")
        .eq("is_active", true);

      if (error) throw error;

      const currentCount = data?.length ?? 0;
      
      setUnpaidCount((prev) => {
        if (prev !== currentCount && !loading) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
        return currentCount;
      });
      
      const dismissedCount = localStorage.getItem("dismissed_unpaid_count");
      if (dismissedCount === currentCount.toString()) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    } catch (err) {
      console.error("Error fetching unpaid count:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    // 1. Get initial user
    supabase.current.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchUnpaidCount(user.id);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription: authSub } } = supabase.current.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id || null;
      setUserId(uid);
      if (uid) fetchUnpaidCount(uid);
    });

    // 3. Set up real-time subscription for students table
    const channel = supabase.current
      .channel("student-payment-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
        },
        () => {
          // If we have a userId, re-fetch
          supabase.current.auth.getUser().then(({ data: { user } }) => {
            if (user) fetchUnpaidCount(user.id);
          });
        }
      )
      .subscribe();

    // 4. Polling fallback (every 30 seconds) just in case Realtime is disabled
    const pollInterval = setInterval(() => {
      supabase.current.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchUnpaidCount(user.id);
      });
    }, 30000);

    return () => {
      authSub.unsubscribe();
      supabase.current.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [fetchUnpaidCount]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    localStorage.setItem("dismissed_unpaid_count", unpaidCount.toString());
  };

  const hasNotifications = unpaidCount > 0 && !isDismissed;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative group h-12 w-12 rounded-2xl transition-all duration-500",
            hasNotifications 
              ? "text-primary bg-primary/5 hover:bg-primary/10 shadow-sm" 
              : "text-on-surface-variant/40 hover:text-primary hover:bg-surface-container"
          )}
        >
          <div className={cn(
            "relative transition-transform duration-500",
            isAnimating ? "scale-110 rotate-12" : "group-hover:scale-110"
          )}>
            <Bell className="h-6 w-6" strokeWidth={2.5} />
            {hasNotifications && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
            )}
          </div>
          
          <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-hover:opacity-10 dark:bg-primary/40 blur-xl transition-opacity pointer-events-none" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        className="w-96 p-0 border-none shadow-premium bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="bg-gradient-to-br from-primary/5 via-white to-white p-6 pb-4">
          <DropdownMenuLabel className="flex items-center justify-between p-0 mb-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">
                Centre de Notifications
              </span>
            </div>
            {unpaidCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-primary/20">
                {unpaidCount} ALERT{unpaidCount > 1 ? "S" : ""}
              </span>
            )}
          </DropdownMenuLabel>
          <h4 className="text-xl font-bold font-manrope text-primary uppercase tracking-tight">Vue d'ensemble</h4>
        </div>
        
        <div className="px-4 pb-4">
          <DropdownMenuSeparator className="bg-surface-container-low mb-2" />
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Synchronisation...</p>
            </div>
          ) : unpaidCount === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-8">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-[2.5rem] bg-surface-container flex items-center justify-center shadow-inner">
                  <Bell className="h-10 w-10 text-primary/10" strokeWidth={1.5} />
                </div>
                <div className="absolute -right-2 -bottom-2 h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border-4 border-white">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <p className="text-lg font-bold text-primary mb-2 font-manrope">Tout est en ordre</p>
              <p className="text-sm text-on-surface-variant/50 font-medium leading-relaxed">
                Aucun retard de paiement détecté. Votre centre fonctionne parfaitement !
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-red-50 to-rose-50/30 p-5 transition-all hover:shadow-md hover:shadow-red-500/5 active:scale-[0.98]">
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 relative">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center">
                      <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
                    </span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-black text-red-900 leading-tight mb-1 flex items-center justify-between">
                      Action requise
                      <button 
                        onClick={handleDismiss}
                        className="h-6 w-6 rounded-lg hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                        title="Ignorer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </p>
                    <p className="text-xs font-semibold text-red-700/60 leading-relaxed mb-4">
                      {unpaidCount} étudiant{unpaidCount > 1 ? "s n'ont" : " n'a"} pas encore réglé ce mois.
                    </p>
                    <Link 
                      href="/students?status=Unpaid"
                      className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-white border border-red-100 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      Détails des impayés
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-4 bg-surface-container-low/50 rounded-2xl border border-surface-container/50 flex items-center gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-bold text-on-surface-variant/40 leading-none">
                    Surveillance en temps réel activée.
                 </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-surface-container-low/30 px-6 py-4 flex items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30">
            Bac-Door Intelligence System
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
