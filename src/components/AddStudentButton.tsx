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
        className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 flex items-center gap-2 h-11 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-primary/20"
      >
        <Plus className="h-4 w-4" />
        <span className="font-bold text-[10px] uppercase tracking-[0.1em]">New Student</span>
      </Button>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
