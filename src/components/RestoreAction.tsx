"use client";

import { RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface RestoreActionProps {
  studentId: string | number;
}

export function RestoreAction({ studentId }: RestoreActionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("students")
        .update({ is_active: true })
        .eq("id", studentId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error restoring student:", error);
      alert("Erreur lors de la restauration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleRestore}
      disabled={loading}
      className="h-8 w-8 text-whatsapp hover:bg-whatsapp/10 rounded-full transition-all active:scale-90"
      title="Restaurer l'étudiant"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
    </Button>
  );
}
