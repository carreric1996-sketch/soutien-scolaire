"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentModal } from "./StudentModal";

export function AddStudentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 flex items-center justify-center gap-2 h-14 md:h-11 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-primary/20"
      >
        <Plus className="h-5 w-5 md:h-4 md:w-4" />
        <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-[0.1em]">Nouvel Étudiant</span>
      </Button>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
