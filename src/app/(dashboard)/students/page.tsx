import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { StudentsTable } from "@/components/StudentsTable";
import { AddStudentButton } from "@/components/AddStudentButton";
import { BroadcastAction } from "@/components/BroadcastAction";
import { Users } from "lucide-react";

export const metadata = {
  title: "Étudiants — Soutien Scolaire",
  description: "Gérez tous vos étudiants inscrits.",
};

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const [{ data: profile }, { data: students, error }] = await Promise.all([
    supabase.from("profiles").select("full_name, center_name").eq("id", user.id).single(),
    supabase
      .from("students")
      .select("*")
      .eq("is_active", true)
      .eq("teacher_id", user.id)
      .order("full_name", { ascending: true }),
  ]);

  const teacherName: string =
    profile?.full_name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Prof. Teacher";
  const centerName: string | undefined = profile?.center_name || undefined;

  if (error) console.error("Error fetching students:", error);

  const studentList = students || [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <p className="text-[10px] lg:text-xs font-black tracking-[0.2em] uppercase text-primary/40 mb-2">
            Gestion
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold font-manrope text-primary flex items-center gap-4">
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            Étudiants
          </h1>
          <p className="mt-2 text-[12px] md:text-sm text-on-surface-variant/60 font-medium">
            {studentList.length} étudiant{studentList.length !== 1 ? "s" : ""} actif{studentList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
          <div className="hidden lg:block">
            <AddStudentButton />
          </div>
          <div className="lg:h-11">
             <BroadcastAction students={studentList} teacherName={teacherName} centerName={centerName} />
          </div>
        </div>
      </div>

      {/* Full management table */}
      <StudentsTable
        students={studentList}
        teacherName={teacherName}
        centerName={centerName}
      />
    </div>
  );
}
