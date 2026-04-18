"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, GraduationCap, Users, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusToggle } from "@/components/StatusToggle";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { StudentActions } from "@/components/StudentActions";
import { StudentDrawer } from "@/components/StudentDrawer";
import { StudentModal } from "@/components/StudentModal";
import { isToday, format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SUBJECT_COLORS, getWhatsAppUrl } from "@/lib/students";

interface StudentsTableProps {
  students: any[];
  teacherName: string;
  centerName?: string;
}



export function StudentsTable({
  students,
  teacherName,
  centerName,
}: StudentsTableProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [editStudent, setEditStudent] = useState<any | null>(null);

  // Set initial status filter from query param
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam === "Unpaid") {
      setFilterStatus("Unpaid");
    }
  }, [searchParams]);

  // Unique subjects and groupes from current student list
  const subjects = Array.from(new Set(students.map((s) => s.subject).filter(Boolean)));
  const groupes = Array.from(new Set(students.map((s) => s.groupe).filter(Boolean)));

  // Open the edit modal and close the drawer so there's no z-index conflict
  const handleEditRequest = useCallback(() => {
    setEditStudent(selectedStudent);
    setSelectedStudent(null);
  }, [selectedStudent]);

  // After the modal saves + closes, clear everything so stale data doesn't linger
  const handleModalClose = useCallback(() => {
    setEditStudent(null);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return students.filter((s) => {
      const matchesQuery =
        !q ||
        s.full_name?.toLowerCase().includes(q) ||
        s.subject?.toLowerCase().includes(q) ||
        s.grade_level?.toLowerCase().includes(q) ||
        s.groupe?.toLowerCase().includes(q);
      const matchesSubject = !filterSubject || s.subject === filterSubject;
      const matchesStatus = !filterStatus || s.status === filterStatus;
      return matchesQuery && matchesSubject && matchesStatus;
    });
  }, [students, query, filterSubject, filterStatus]);

  return (
    <>
      {/* Search + filter row */}
      <div className="flex flex-col gap-4">
        <div className="relative group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, matière, niveau ou groupe..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low/50 glass rounded-full text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all border-none placeholder:text-on-surface-variant/40 shadow-premium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Subject filter pills */}
          {subjects.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 whitespace-nowrap">
              <button
                onClick={() => setFilterSubject("")}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0",
                  filterSubject === ""
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-on-surface-variant/60 border-surface-container hover:border-primary/30"
                )}
              >
                Tous
              </button>
              {subjects.map((subj: string) => (
                <button
                  key={subj}
                  onClick={() => setFilterSubject(filterSubject === subj ? "" : subj)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0",
                    filterSubject === subj
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-on-surface-variant/60 border-surface-container hover:border-primary/30"
                  )}
                >
                  {subj}
                </button>
              ))}
            </div>
          )}

          {/* Status filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setFilterStatus(null)}
              className={cn(
                "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0",
                filterStatus === null
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-on-surface-variant/60 border-surface-container hover:border-primary/30"
              )}
            >
              Tous les statuts
            </button>
            <button
              onClick={() => setFilterStatus("Unpaid")}
              className={cn(
                "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0",
                filterStatus === "Unpaid"
                  ? "bg-red-500 text-white border-red-500 shadow-md"
                  : "bg-white text-red-500 border-red-100 hover:border-red-300"
              )}
            >
              Impayés
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <Card className="border-none bg-surface-container-lowest/80 glass shadow-premium overflow-hidden p-1">
        {filtered.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white/50">
            <div className="h-20 w-20 rounded-3xl bg-surface-container-low flex items-center justify-center mb-6 shadow-sm">
              {query ? (
                <Search className="h-9 w-9 text-primary/20" />
              ) : (
                <Users className="h-9 w-9 text-primary/20" />
              )}
            </div>
            <h3 className="text-xl font-bold font-manrope text-primary mb-2">
              {query ? "Aucun résultat" : "Aucun étudiant"}
            </h3>
            <p className="text-sm text-on-surface-variant/60 font-medium max-w-xs">
              {query
                ? `Aucun étudiant ne correspond à "${query}".`
                : 'Commencez par inscrire un nouvel étudiant.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4 p-4">
              {filtered.map((student) => {
                const subjectColor =
                  SUBJECT_COLORS[student.subject] ?? "bg-surface-container-low text-on-surface-variant/60";
                const isPaid = student.status === "Paid";
                const initials = student.full_name
                  ?.split(" ")
                  .slice(0, 2)
                  .map((n: string) => n[0])
                  .join("");

                return (
                  <Card key={student.id} className="p-5 border-none bg-white shadow-premium space-y-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="h-14 w-14 rounded-2xl bg-surface-container flex items-center justify-center text-sm font-bold text-primary shrink-0 shadow-sm relative transition-transform active:scale-95"
                      >
                        {initials}
                        <span 
                          className={cn(
                            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm", 
                            isPaid ? "bg-emerald-500" : "bg-red-500"
                          )} 
                        />
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0" onClick={() => setSelectedStudent(student)}>
                        <h4 className="font-bold text-lg text-primary font-manrope truncate leading-tight">
                          {student.full_name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {student.subject && (
                            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", subjectColor)}>
                              {student.subject}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wide bg-surface-container-low px-2 py-0.5 rounded-md">
                            <GraduationCap className="h-3 w-3 opacity-40" />
                            {student.grade_level}
                          </span>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="shrink-0 flex items-center justify-center h-10 w-10">
                         <StudentActions student={student} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Status Toggle - Thumb friendly */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/30 pl-1">
                          Statut de Paiement
                        </span>
                        <StatusToggle 
                          studentId={student.id} 
                          initialStatus={student.status} 
                          className="w-full h-12 text-sm"
                        />
                        {student.last_payment_date && (
                          <p className="text-[9px] font-bold text-on-surface-variant/30 pl-1 mt-0.5">
                            Dernier paiement : {format(new Date(student.last_payment_date), "d MMMM yyyy", { locale: fr })}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp - Thumb friendly */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/30 pl-1">
                          Relancer par WhatsApp
                        </span>
                        {student.parent_phone ? (
                          <WhatsAppAction
                            studentId={student.id}
                            url={getWhatsAppUrl(
                              student.parent_phone,
                              student.status,
                              student.full_name,
                              teacherName,
                              centerName
                            )}
                            className="w-full h-12 bg-whatsapp/10 text-[#002109] flex items-center justify-center gap-3 border-none p-0"
                          />
                        ) : (
                          <div className="h-12 w-full rounded-xl bg-surface-container-low flex items-center justify-center text-[10px] font-bold text-on-surface-variant/30 italic">
                            Aucun numéro de téléphone
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-surface-container-low/30">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 px-8 py-6 font-inter">
                      Étudiant
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 font-inter">
                      Niveau
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 font-inter">
                      Matière
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 font-inter">
                      Groupe
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 font-inter">
                      Paiement
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 font-inter text-right">
                      Frais
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/50 text-right px-8 font-inter">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((student) => {
                    const subjectColor =
                      SUBJECT_COLORS[student.subject] ?? "bg-surface-container-low text-on-surface-variant/60";

                    return (
                      <TableRow
                        key={student.id || student.parent_phone}
                        className="border-none hover:bg-surface-container-low/80 transition-all duration-300 group"
                      >
                        {/* Student Name — clickable */}
                        <TableCell className="px-8 py-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="flex items-center gap-4 text-left group/name"
                          >
                            <div className="h-10 w-10 rounded-2xl bg-surface-container flex items-center justify-center text-xs font-bold text-primary shrink-0 transition-transform group-hover/name:scale-105 shadow-sm">
                              {student.full_name
                                ?.split(" ")
                                .slice(0, 2)
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary font-manrope group-hover/name:text-primary_container transition-colors">
                                {student.full_name}
                              </p>
                              <p className="text-[11px] font-medium text-on-surface-variant/50 font-inter">
                                {student.parent_phone}
                              </p>
                            </div>
                          </button>
                        </TableCell>

                        {/* Level */}
                        <TableCell className="text-sm font-semibold text-on-surface-variant/80 font-inter">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-3.5 w-3.5 text-primary/30" />
                            {student.grade_level}
                          </div>
                        </TableCell>

                        {/* Subject badge */}
                        <TableCell>
                          {student.subject ? (
                            <span
                              className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-inter",
                                subjectColor
                              )}
                            >
                              {student.subject}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/20 text-xs">—</span>
                          )}
                        </TableCell>

                        {/* Groupe */}
                        <TableCell className="text-[11px] font-bold text-on-surface-variant/70 font-inter">
                          {student.groupe ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-container-high/50 text-primary border-none shadow-sm">
                              {student.groupe}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/20 text-xs">—</span>
                          )}
                        </TableCell>

                        {/* Payment status */}
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StatusToggle
                              studentId={student.id}
                              initialStatus={student.status}
                            />
                            <div className="flex flex-col gap-0.5">
                              {student.last_payment_date && (
                                <p className="text-[9px] font-bold text-on-surface-variant/40 pl-1">
                                  Dernier: <span className="text-primary/60">{format(new Date(student.last_payment_date), "d MMM", { locale: fr })}</span>
                                </p>
                              )}
                              {student.last_reminded_at && (
                                <p
                                  className={cn(
                                    "text-[8px] font-black uppercase tracking-widest pl-1",
                                    isToday(new Date(student.last_reminded_at))
                                      ? "text-orange-500"
                                      : "text-on-surface-variant/30"
                                  )}
                                >
                                  {isToday(new Date(student.last_reminded_at))
                                    ? "Relancé"
                                    : `Relance: ${format(new Date(student.last_reminded_at), "d MMM", { locale: fr })}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Monthly fee */}
                        <TableCell className="text-sm font-bold text-primary text-right font-manrope pr-4">
                          {student.monthly_fee?.toLocaleString()} <span className="text-[10px] opacity-40">MAD</span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right px-8">
                          <div className="flex items-center justify-end gap-2">
                            {student.parent_phone && (
                              <WhatsAppAction
                                studentId={student.id}
                                url={getWhatsAppUrl(
                                  student.parent_phone,
                                  student.status,
                                  student.full_name,
                                  teacherName,
                                  centerName
                                )}
                              />
                            )}
                            <StudentActions student={student} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <div className="p-8 bg-surface-container-low/20 flex items-center justify-between text-[11px] text-on-surface-variant/50 font-bold uppercase tracking-widest font-inter">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/20 animate-pulse" />
            {query
              ? `${filtered.length} / ${students.length} Étudiants`
              : `${students.length} Étudiants inscrits`}
          </span>
          <div className="flex gap-2">
            <button className="h-8 w-8 rounded-xl bg-white/50 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30 border-none shadow-sm" disabled>
              &lt;
            </button>
            <button className="h-8 w-8 rounded-xl bg-white/50 flex items-center justify-center hover:bg-white transition-colors border-none shadow-sm">&gt;</button>
          </div>
        </div>
      </Card>

      {/* Student profile drawer */}
      {selectedStudent && (
        <StudentDrawer
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEditRequest={handleEditRequest}
          whatsAppUrl={
            selectedStudent.parent_phone
              ? getWhatsAppUrl(
                  selectedStudent.parent_phone,
                  selectedStudent.status,
                  selectedStudent.full_name,
                  teacherName,
                  centerName
                )
              : undefined
          }
        />
      )}

      {/* Edit modal — rendered OUTSIDE the drawer so z-index is always on top */}
      <StudentModal
        isOpen={!!editStudent}
        onClose={handleModalClose}
        student={editStudent}
      />
    </>
  );
}
