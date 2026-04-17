"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Check, Clock } from "lucide-react";

interface StatusToggleProps {
  studentId: string | number;
  initialStatus: string;
}

export function StatusToggle({ studentId, initialStatus }: StatusToggleProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const toggleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;

    const newStatus = status === "Paid" ? "Unpaid" : "Paid";
    const previousStatus = status;
    
    const updateData: any = { status: newStatus };
    if (newStatus === "Paid") {
      updateData.last_payment_date = new Date().toISOString();
    }
    
    setStatus(newStatus);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", studentId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(previousStatus);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = status === "Paid";

  return (
    <button 
      onClick={toggleStatus} 
      disabled={loading}
      className={cn(
        "relative group flex items-center justify-center h-8 px-4 rounded-xl transition-all duration-500 overflow-hidden shadow-sm active:scale-95",
        isPaid 
          ? "bg-tertiary-on/10 text-tertiary-on" 
          : "bg-error/10 text-error",
        loading && "opacity-50 cursor-not-allowed"
      )}
      title={isPaid ? "Marquer comme non payé" : "Marquer comme payé"}
    >
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isPaid ? (
          <Check className="h-3.5 w-3.5 font-black" />
        ) : (
          <Clock className="h-3.5 w-3.5 font-black" />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest font-inter">
          {isPaid ? "Payé" : "Impayé"}
        </span>
      </div>
      
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}
