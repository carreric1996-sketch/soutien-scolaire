"use client";

import { useState, useEffect } from "react";
import { X, User, GraduationCap, Phone, Loader2, BookOpen, CreditCard, Calendar, StickyNote, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: any;
}

const SUBJECTS = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Anglais",
  "Français",
  "Philosophie",
  "Informatique",
  "Autre"
];

export function StudentModal({ isOpen, onClose, student }: StudentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gradeLevel: "",
    parentWhatsApp: "",
    subject: "Mathématiques",
    groupe: "",
    monthlyFee: "",
    startDate: new Date().toISOString().split('T')[0],
    internalNotes: "",
  });

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        fullName: student.full_name || "",
        gradeLevel: student.grade_level || "",
        parentWhatsApp: student.parent_phone || "",
        subject: student.subject || "Mathématiques",
        groupe: student.groupe || "",
        monthlyFee: student.monthly_fee?.toString() || "",
        startDate: student.start_date || new Date().toISOString().split('T')[0],
        internalNotes: student.internal_notes || "",
      });
    } else if (!student && isOpen) {
      setFormData({ 
        fullName: "", 
        gradeLevel: "", 
        parentWhatsApp: "",
        subject: "Mathématiques",
        groupe: "",
        monthlyFee: "",
        startDate: new Date().toISOString().split('T')[0],
        internalNotes: ""
      });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName,
        grade_level: formData.gradeLevel,
        parent_phone: formData.parentWhatsApp,
        subject: formData.subject,
        groupe: formData.groupe || null,
        monthly_fee: formData.monthlyFee ? Number(formData.monthlyFee) : null,
        start_date: formData.startDate,
        internal_notes: formData.internalNotes,
      };

      let error;
      if (student) {
        const { error: updateError } = await supabase
          .from("students")
          .update(payload)
          .eq("id", student.id);
        error = updateError;
      } else {
        // Fetch current user for teacher_id
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("Une session est requise pour ajouter un étudiant.");

        const { error: insertError } = await supabase
          .from("students")
          .insert([{ 
            ...payload, 
            status: "Unpaid",
            teacher_id: user.id 
          }]);
        error = insertError;
      }

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        router.refresh();
      }, 1500);

    } catch (error) {
      console.error("Error saving student:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-premium overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess && (
          <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="h-20 w-20 rounded-full bg-whatsapp/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-whatsapp" />
            </div>
            <h3 className="text-xl font-bold text-primary">Succès !</h3>
            <p className="text-sm font-medium text-on-surface-variant/60">{student ? "Informations mises à jour." : "Étudiant inscrit avec succès."}</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-primary px-8 py-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              {student ? <StickyNote className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-manrope">{student ? "Modifier l'Étudiant" : "Inscription Étudiant"}</h2>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">{student ? `ID: #${student.id.toString().slice(-4)}` : "Système de Gestion Bac-Door"}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Nom Complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Ahmed Alami"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Grade Level */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Niveau d'études</label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  required
                  type="text"
                  placeholder="e.g. 2Bac PC"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                />
              </div>
            </div>

            {/* Parent WhatsApp */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">WhatsApp Parent</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  required
                  type="tel"
                  placeholder="+212 6XXXXXXXX"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.parentWhatsApp}
                  onChange={(e) => setFormData({ ...formData, parentWhatsApp: e.target.value })}
                />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Matière</label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <select
                  required
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all appearance-none outline-none text-primary"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  {SUBJECTS.map(subj => (
                    <option key={subj} value={subj} className="text-primary font-semibold">{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Groupe */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Groupe</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  type="text"
                  placeholder="e.g. Groupe A, Lundi/Mercredi"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.groupe}
                  onChange={(e) => setFormData({ ...formData, groupe: e.target.value })}
                />
              </div>
            </div>

            {/* Monthly Fee */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Frais Mensuels</label>
              <div className="relative group">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  required
                  type="number"
                  placeholder="500"
                  className="w-full pl-11 pr-14 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-on-surface-variant/40">MAD</span>
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Date d'inscription</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                  required
                  type="date"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 ml-1">Notes Internes</label>
              <div className="relative group">
                <StickyNote className="absolute left-4 top-4 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <textarea
                  rows={2}
                  placeholder="Remarques particulières, niveau actuel, objectifs..."
                  className="w-full pl-11 pr-4 py-4 bg-surface-container-low/50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary/10 focus:bg-white transition-all outline-none resize-none"
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 h-12 rounded-[1.25rem] font-bold uppercase text-[10px] tracking-widest text-on-surface-variant/40 hover:bg-surface-container-low transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] h-12 rounded-[1.25rem] font-bold uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-white shadow-premium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                student ? "Sauvegarder" : "Inscrire l'étudiant"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
