import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentActions } from "@/components/StudentActions";
import { RestoreAction } from "@/components/RestoreAction";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Archive, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ArchivePage() {
  const supabase = await createClient();

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch archived students from Supabase linked to THIS teacher
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("is_active", false)
    .eq("teacher_id", user.id)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching archived students:", error);
  }

  const studentList = students || [];

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Link href="/dashboard" className="h-10 w-10 rounded-full bg-white border border-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-sm">
              <ArrowLeft className="h-4 w-4" />
           </Link>
           <div>
              <h2 className="text-3xl font-bold font-manrope text-primary tracking-tight">Archives Étudiants</h2>
              <p className="text-sm font-medium text-on-surface-variant/60">Gérez les comptes désactivés ou supprimez-les définitivement.</p>
           </div>
        </div>
      </div>

      {/* Hero Card for Archive Info */}
      <Card className="border-none bg-surface-container-low p-10 shadow-premium relative overflow-hidden group">
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Archive className="h-6 w-6 text-primary" />
               </div>
               <h3 className="text-2xl font-bold font-manrope text-primary">{studentList.length} Étudiants archivés</h3>
               <p className="text-sm text-on-surface-variant/50 max-w-md leading-relaxed">
                  Ces étudiants ne sont plus visibles sur le tableau de bord principal. Vous pouvez les restaurer à tout moment ou nettoyer votre base de données.
               </p>
            </div>
         </div>
         <Trash2 className="absolute -right-8 -bottom-8 h-64 w-64 text-primary opacity-[0.03] rotate-12" />
      </Card>

      {/* Archived Students Table */}
      <div className="space-y-6">
        <Card className="border-none bg-white shadow-premium overflow-hidden p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60 px-6 py-6">Student Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">Level</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">Matière</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentList.length > 0 ? (
                studentList.map((student) => (
                  <TableRow key={student.id} className="border-none hover:bg-surface-container-low/50 transition-colors group">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary">
                          {student.full_name?.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary">{student.full_name}</p>
                          <p className="text-xs text-on-surface-variant/60">{student.parent_phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-on-surface-variant/80">{student.grade_level}</TableCell>
                    <TableCell className="text-sm font-medium text-primary/60">{student.subject || "N/A"}</TableCell>
                    <TableCell className="text-right px-6 flex items-center justify-end gap-2 py-5">
                      <RestoreAction studentId={student.id} />
                      <StudentActions student={student} isArchived={true} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20 text-on-surface-variant/40 font-medium italic">
                    Aucun étudiant dans les archives.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
