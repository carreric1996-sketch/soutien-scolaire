import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddStudentButton } from "@/components/AddStudentButton";
import { BroadcastAction } from "@/components/BroadcastAction";
import { TrendingUp, CreditCard, Calendar, FileText, CheckSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusToggle } from "@/components/StatusToggle";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { SUBJECT_COLORS, getWhatsAppUrl } from "@/lib/students";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";



export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const [{ data: profile }, { data: students }] = await Promise.all([
    supabase.from("profiles").select("full_name, center_name").eq("id", user.id).single(),
    supabase
      .from("students")
      .select("*")
      .eq("is_active", true)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const teacherName: string =
    profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Prof. Teacher";
  const centerName: string | undefined = profile?.center_name || undefined;

  // Metrics: need all active students for revenue count, fetch separately
  const { data: allStudents } = await supabase
    .from("students")
    .select("status, monthly_fee")
    .eq("is_active", true)
    .eq("teacher_id", user.id);

  const allList = allStudents || [];
  const studentList = students || [];

  const totalRevenue = allList
    .filter((s) => s.status === "Paid")
    .reduce((acc, s) => acc + (Number(s.monthly_fee) || 0), 0);
  const activeStudents = allList.length;
  const paidCount = allList.filter((s) => s.status === "Paid").length;

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Metrics Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-12">
        <Card className="col-span-1 md:col-span-8 border-none bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] py-6 md:pt-12 md:pb-16 px-6 md:px-12 text-white shadow-premium relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-50 mb-3">
              Revenus ce mois
            </p>
            <h2 className="text-xl md:text-5xl font-bold font-manrope whitespace-nowrap">
              {totalRevenue.toLocaleString()}{" "}
              <span className="text-[10px] md:text-xl opacity-60">MAD</span>
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full w-fit backdrop-blur-md">
                <TrendingUp className="h-4 w-4 text-whatsapp" />
                <span className="text-xs font-bold text-whatsapp tracking-wide">
                  {paidCount}/{activeStudents} payés
                </span>
              </div>
            </div>
          </div>
          <CreditCard className="absolute -right-8 -bottom-8 h-72 w-72 text-white opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-700" />
        </Card>

        <Card className="col-span-1 md:col-span-4 border-none bg-white py-6 md:pt-12 md:pb-16 px-6 md:px-10 shadow-premium flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant opacity-50 mb-3">
            Étudiants actifs
          </p>
          <h2 className="text-3xl md:text-5xl font-bold font-manrope text-primary">{activeStudents}</h2>
          <div className="mt-4 md:mt-8 flex -space-x-1.5 md:-space-x-2 overflow-hidden">
            {allList.slice(0, 2).map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 md:h-9 md:w-9 rounded-full border-2 border-white bg-surface-container shadow-sm flex items-center justify-center text-[7px] md:text-[10px] font-bold text-primary shrink-0"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {activeStudents > 2 && (
              <div className="h-6 w-6 md:h-9 md:w-9 rounded-full border-2 border-white bg-surface-container-low flex items-center justify-center text-[7px] md:text-[10px] font-bold text-on-surface-variant shadow-sm shrink-0">
                +{activeStudents - 2}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Dernières Inscriptions */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-manrope text-primary">Dernières Inscriptions</h3>
            <p className="text-[10px] md:text-xs text-on-surface-variant/50 font-medium mt-0.5 md:mt-1">
              Les 5 étudiants les plus récemment inscrits
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial">
               <BroadcastAction students={allList as any[]} teacherName={teacherName} centerName={centerName} />
            </div>
            <div className="flex-1 md:flex-initial">
               <AddStudentButton />
            </div>
            <Link
              href="/students"
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-wider whitespace-nowrap ml-2"
            >
              Voir tous <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <Card className="border-none bg-transparent md:bg-white shadow-none md:shadow-sm overflow-hidden p-0 md:p-2">
          {/* Mobile view for recent inscriptions */}
          <div className="md:hidden space-y-3">
             {studentList.length === 0 ? (
               <div className="py-12 text-center bg-white rounded-2xl shadow-sm border-none p-6">
                 <p className="text-on-surface-variant/40 font-medium italic text-sm">Aucun étudiant récent.</p>
               </div>
             ) : (
               studentList.map((student) => (
                 <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border-none flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                        {student.full_name?.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-primary">{student.full_name}</p>
                        <p className="text-[10px] text-on-surface-variant/50 font-medium uppercase tracking-wider">{student.subject}</p>
                      </div>
                    </div>
                    <StatusToggle studentId={student.id} initialStatus={student.status} className="h-8 px-3" />
                 </div>
               ))
             )}
             <Link
                href="/students"
                className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-primary bg-primary/5 rounded-xl transition-colors uppercase tracking-wider mt-2 w-full"
              >
                Gérer tous les étudiants <ArrowRight className="h-3.5 w-3.5" />
              </Link>
          </div>

          {/* Desktop view for recent inscriptions */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60 px-6 py-6">
                    Étudiant
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                    Niveau
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                    Matière
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">
                    Paiement
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60 text-right px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16 text-on-surface-variant/40 font-medium italic">
                      Aucun étudiant inscrit. Cliquez sur "Nouvel Étudiant" pour commencer.
                    </TableCell>
                  </TableRow>
                ) : (
                  studentList.map((student) => {
                    const isPaid = student.status === "Paid";
                    const subjectColor = SUBJECT_COLORS[student.subject] ?? "bg-gray-50 text-gray-600";
                    return (
                      <TableRow
                        key={student.id}
                        className="border-none hover:bg-surface-container-low/50 transition-colors"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary shrink-0 relative">
                              {student.full_name?.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                              <span 
                                className={cn(
                                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white shadow-sm",
                                  isPaid ? "bg-emerald-500" : "bg-red-500"
                                )} 
                                title={isPaid ? "Payé" : "Impayé"}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary">{student.full_name}</p>
                              <p className="text-[11px] text-on-surface-variant/50">{student.parent_phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-on-surface-variant/70">
                          {student.grade_level}
                        </TableCell>
                        <TableCell>
                          {student.subject ? (
                            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", subjectColor)}>
                              {student.subject}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant/30 text-xs">—</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <StatusToggle
                              studentId={student.id}
                              initialStatus={student.status}
                            />
                            {student.last_payment_date && (
                              <p className="text-[9px] font-bold text-on-surface-variant/30 pl-1">
                                Dernier: {format(new Date(student.last_payment_date), "d MMM", { locale: fr })}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right px-6">
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-4 gap-6">
        <QuickActionCard icon={Calendar} title="Upcoming Sessions" description="8 sessions scheduled today" />
        <QuickActionCard icon={FileText} title="Academic Reports" description="12 reports pending review" />
        <QuickActionCard icon={CheckSquare} title="Assignments" description="Check new submissions" />
        <BroadcastAction students={allList as any[]} teacherName={teacherName} centerName={centerName} variant="card" />
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="border-none p-6 shadow-sm transition-all hover:translate-y-[-4px] cursor-pointer bg-surface-container-low hover:bg-surface-container text-primary">
      <div className="p-2 bg-white/20 rounded-lg w-fit mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="font-bold text-sm tracking-tight">{title}</p>
      <p className="text-xs font-medium opacity-60 text-on-surface-variant mt-1">{description}</p>
    </Card>
  );
}
