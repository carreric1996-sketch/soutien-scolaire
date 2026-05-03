"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentModal } from "./StudentModal";
import { cn } from "@/lib/utils";

export function AddStudentFAB() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-24 right-5 z-[60] lg:hidden">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "h-16 w-16 rounded-2xl bg-primary text-white shadow-premium flex items-center justify-center transition-all duration-300",
            "hover:scale-105 active:scale-95 hover:shadow-2xl",
            "after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:bg-white/10 after:opacity-0 hover:after:opacity-100"
          )}
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
