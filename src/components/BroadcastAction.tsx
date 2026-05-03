"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BroadcastModal } from "./BroadcastModal";
import { cn } from "@/lib/utils";
import { Student } from "@/types/student";

interface BroadcastActionProps {
  students: Student[];
  teacherName: string;
  centerName?: string;
  variant?: "button" | "card" | "sidebar-item";
  className?: string;
}

export function BroadcastAction({ students, teacherName, centerName, variant = "button", className }: BroadcastActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "card") {
    return (
      <>
        <div 
          onClick={() => setIsOpen(true)}
          className={cn("bg-whatsapp text-[#002109] border-none p-6 shadow-sm transition-all hover:translate-y-[-4px] cursor-pointer rounded-xl group", className)}
        >
          <div className="p-2 bg-white/20 rounded-lg w-fit mb-4 group-hover:bg-white/30 transition-colors">
            <MessageSquare className="h-5 w-5 text-[#002109]" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-tight">WhatsApp Broadcast</p>
            <p className="text-xs font-medium opacity-60 text-[#002109]">Quick Message Parents</p>
          </div>
        </div>
        <BroadcastModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          students={students}
          teacherName={teacherName}
          centerName={centerName}
        />
      </>
    );
  }

  if (variant === "sidebar-item") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "group flex items-center px-3 py-2 mx-3 justify-start font-semibold cursor-pointer rounded-xl transition-all duration-200 font-inter text-sm text-white/55 hover:text-white/90 hover:bg-white/5",
            className
          )}
        >
          <div className="flex items-center flex-1">
            <Send className="h-5 w-5 mr-3 transition-colors" />
            Broadcast
          </div>
        </button>
        <BroadcastModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
          students={students}
          teacherName={teacherName}
          centerName={centerName}
        />
      </>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost" 
        className={cn("h-11 px-6 rounded-lg font-bold text-xs uppercase tracking-wider text-whatsapp hover:bg-whatsapp/10 flex items-center gap-2 transition-all border border-whatsapp/20", className)}
      >
        <Send className="h-4 w-4" />
        WhatsApp Broadcast
      </Button>

      <BroadcastModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        students={students}
        teacherName={teacherName}
        centerName={centerName}
      />
    </>
  );
}
