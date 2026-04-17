"use client";

import { useState, useMemo } from "react";
import { X, MessageSquare, ExternalLink, Calendar, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Student {
  id: string | number;
  full_name: string;
  parent_phone: string;
  status: string;
  last_reminded_at?: string | null;
}

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacherName: string;
  centerName?: string;
}

function getWhatsAppUrl(phone: string, studentName: string, teacherName: string, centerName?: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  const sender = centerName ? `${teacherName} (${centerName})` : teacherName;
  const message = `Bonjour, c'est ${sender}. Je vous contacte pour le suivi du cours de Maths/Physique de ${studentName}. Pourriez-vous nous envoyer le règlement pour ce mois ? Merci !`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function BroadcastModal({ isOpen, onClose, students, teacherName, centerName }: BroadcastModalProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const unpaidStudents = useMemo(() => 
    students.filter(s => s.status !== "Paid"),
    [students]
  );

  if (!isOpen) return null;

  const handleSendReminder = async (studentId: string | number) => {
    const now = new Date().toISOString();
    try {
      const { error } = await supabase
        .from("students")
        .update({ last_reminded_at: now })
        .eq("id", studentId);

      if (error) {
        console.warn("Could not update last_reminded_at. Did you add the column? SQL: ALTER TABLE students ADD COLUMN last_reminded_at TIMESTAMP WITH TIME ZONE;");
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error updating reminder date:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-premium overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-8 py-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Send className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-manrope">Diffusion WhatsApp</h2>
              <p className="text-white/60 text-xs font-medium uppercase tracking-[0.1em]">Relances pour {unpaidStudents.length} étudiants</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              Liste des impayés
            </h3>
            <div className="px-3 py-1 bg-red-50 rounded-full text-[10px] font-bold text-red-600 uppercase">
              Action requise
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {unpaidStudents.length === 0 ? (
              <div className="text-center py-12 bg-surface-container-low rounded-3xl border-2 border-dashed border-surface-container">
                <CheckCircle2 className="h-12 w-12 text-whatsapp mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium text-on-surface-variant/60">Tous les étudiants sont à jour !</p>
              </div>
            ) : (
              unpaidStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      {student.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary">{student.full_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-medium text-on-surface-variant/60">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {student.last_reminded_at 
                            ? `Dernière relance: ${format(new Date(student.last_reminded_at), "d MMMM", { locale: fr })}`
                            : "Jamais relancé"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={getWhatsAppUrl(student.parent_phone, student.full_name, teacherName, centerName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSendReminder(student.id)}
                    className="bg-whatsapp hover:bg-whatsapp/90 text-white rounded-xl h-10 px-4 flex items-center gap-2 shadow-sm border-none transition-all active:scale-95 no-underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Envoyer</span>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex justify-end">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-[10px] tracking-widest text-on-surface-variant/60 hover:bg-surface-container">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
