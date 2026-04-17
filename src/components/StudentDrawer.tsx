"use client";

import { useState, useTransition, useEffect } from "react";
import { X, GraduationCap, Phone, BookOpen, CreditCard, Calendar, StickyNote, Loader2, CheckCircle2, MessageSquare, Edit2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StudentDrawerProps {
  student: any | null;
  onClose: () => void;
  onEditRequest: () => void;
  onArchiveComplete?: () => void; // optional cb after archiving
  whatsAppUrl?: string;
}

export function StudentDrawer({ student, onClose, onEditRequest, onArchiveComplete, whatsAppUrl }: StudentDrawerProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<string>(student?.internal_notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  // Sync notes whenever the selected student changes
  useEffect(() => {
    setNotes(student?.internal_notes ?? "");
    setSaved(false);
  }, [student?.id, student?.internal_notes]);

  if (!student) return null;

  const initials = student.full_name
    ?.split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  const isPaid = student.status === "Paid";

  const [isArchiving, startArchiveTransition] = useTransition();

  const handleArchive = () => {
    startArchiveTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("students")
        .update({ is_active: false })
        .eq("id", student.id);
      onClose();
      if (onArchiveComplete) onArchiveComplete();
      router.refresh();
    });
  };

  const handleSaveNotes = () => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("students")
        .update({ internal_notes: notes })
        .eq("id", student.id);

      if (!error) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    });
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-[80] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] px-8 py-10 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold">{initials}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-1">
                Profil Étudiant
              </p>
              <h2 className="text-xl font-bold font-manrope leading-tight">
                {student.full_name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full",
                    isPaid
                      ? "bg-white/20 text-white"
                      : "bg-red-400/30 text-white"
                  )}
                >
                  {isPaid ? "✓ Payé" : "⚠ Impayé"}
                </span>
                {student.subject && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white">
                    {student.subject}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-7">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon={GraduationCap} label="Niveau" value={student.grade_level} />
            <InfoCard icon={BookOpen} label="Matière" value={student.subject ?? "—"} />
            <InfoCard icon={Phone} label="Tel. Parent" value={student.parent_phone} />
            <InfoCard
              icon={CreditCard}
              label="Frais mensuels"
              value={
                student.monthly_fee
                  ? `${Number(student.monthly_fee).toLocaleString()} MAD`
                  : "—"
              }
            />
            {student.groupe && (
              <InfoCard icon={GraduationCap} label="Groupe" value={student.groupe} className="col-span-2" />
            )}
            {student.start_date && (
              <InfoCard
                icon={Calendar}
                label="Inscrit le"
                value={format(new Date(student.start_date), "d MMM yyyy", { locale: fr })}
                className="col-span-2"
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-primary/60" />
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
                Notes du professeur
              </p>
            </div>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSaved(false);
              }}
              rows={5}
              placeholder="Ajouter des remarques, objectifs ou observations sur cet étudiant..."
              className="w-full px-4 py-4 bg-surface-container-low rounded-2xl text-sm font-medium text-primary placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary/20 transition-all resize-none"
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveNotes}
                disabled={isPending}
                className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <StickyNote className="h-3.5 w-3.5" />
                )}
                {isPending ? "Saving…" : "Sauvegarder"}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-whatsapp animate-in fade-in duration-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 px-8 py-6 border-t border-surface-container-low space-y-3">
          <div className="flex gap-3">
            {whatsAppUrl && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-11 rounded-xl bg-whatsapp/90 hover:bg-whatsapp text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 no-underline"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            <Button
              onClick={onEditRequest}
              variant="outline"
              className="flex-1 h-11 rounded-xl border-2 border-surface-container text-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>
          </div>
          {/* Archive — soft delete */}
          <Button
            onClick={handleArchive}
            disabled={isArchiving}
            variant="ghost"
            className="w-full h-10 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant/50 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-all"
          >
            {isArchiving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
            {isArchiving ? "Archivage..." : "Archiver l'étudiant"}
          </Button>
        </div>
      </div>
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: any;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-surface-container-low rounded-2xl p-4 space-y-1", className)}>
      <div className="flex items-center gap-1.5 text-on-surface-variant/50">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm font-bold text-primary">{value || "—"}</p>
    </div>
  );
}
