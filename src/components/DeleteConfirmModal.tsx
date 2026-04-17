"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  isPermanent?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, student, isPermanent = false }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (isPermanent) {
        const { error } = await supabase
          .from("students")
          .delete()
          .eq("id", student.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("students")
          .update({ is_active: false })
          .eq("id", student.id);
        if (error) throw error;
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error handling deletion:", error);
      alert("Erreur lors de l'opération supprimée.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-premium overflow-hidden animate-in zoom-in-95 duration-200 p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-3">Êtes-vous sûr ?</h3>
          <p className="text-sm text-on-surface-variant/60 leading-relaxed mb-8">
            {isPermanent 
              ? <>Vous allez supprimer <span className="font-bold text-primary">{student.full_name}</span> <strong>définitivement</strong>. Cette action est irréversible.</>
              : <>Vous allez archiver <span className="font-bold text-primary">{student.full_name}</span>. Il pourra être restauré plus tard.</>
            }
          </p>

          <div className="flex gap-4 w-full">
            <Button 
              variant="ghost" 
              className="flex-1 h-12 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-on-surface-variant/40 hover:bg-surface-container-low"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              className="flex-1 h-12 rounded-2xl font-bold uppercase text-[10px] tracking-widest bg-red-500 hover:bg-red-600 text-white shadow-premium flex items-center justify-center gap-2"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
