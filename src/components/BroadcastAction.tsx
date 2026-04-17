"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BroadcastModal } from "./BroadcastModal";
import { cn } from "@/lib/utils";

interface BroadcastActionProps {
  students: any[];
  teacherName: string;
  centerName?: string;
  variant?: "button" | "card";
}

export function BroadcastAction({ students, teacherName, centerName, variant = "button" }: BroadcastActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "card") {
    return (
      <>
        <div 
          onClick={() => setIsOpen(true)}
          className="bg-whatsapp text-[#002109] border-none p-6 shadow-sm transition-all hover:translate-y-[-4px] cursor-pointer rounded-xl group"
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

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost" 
        className="h-11 px-6 rounded-lg font-bold text-xs uppercase tracking-wider text-whatsapp hover:bg-whatsapp/10 flex items-center gap-2 transition-all border border-whatsapp/20"
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
