"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WhatsAppActionProps {
  studentId: string | number;
  url: string;
  className?: string;
}

export function WhatsAppAction({ studentId, url, className }: WhatsAppActionProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    window.open(url, "_blank");

    const updateTracking = async () => {
      try {
        await supabase
          .from("students")
          .update({ last_reminded_at: new Date().toISOString() })
          .eq("id", studentId);

        router.refresh();
      } catch (err) {
        console.error("Error updating last_reminded_at:", err);
      }
    };

    updateTracking();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
      className={cn(
        "h-9 w-9 bg-tertiary-fixed/10 text-tertiary-on hover:bg-tertiary-fixed/30 hover:scale-110 transition-all rounded-xl shadow-sm border-none active:scale-95 flex items-center justify-center p-0",
        className
      )}
      title="Relancer via WhatsApp"
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  );
}

}
