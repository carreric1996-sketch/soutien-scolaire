"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentModal } from "./StudentModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentActionsProps {
  student: any;
  isArchived?: boolean;
}

export function StudentActions({ student, isArchived = false }: StudentActionsProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 text-primary/40 transition-all rounded-xl hover:bg-surface-container-low active:scale-95 group data-[state=open]:bg-primary/5 data-[state=open]:text-primary"
              )}
            >
              <MoreVertical className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-surface-container-lowest/80 glass shadow-premium border-none p-2 z-[50]"
          >
            {!isArchived && (
              <>
                <DropdownMenuItem 
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl cursor-pointer transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5 opacity-40" />
                  Modifier
                </DropdownMenuItem>
                <div className="h-1 bg-surface-container-low/30 my-1 mx-2 rounded-full" />
              </>
            )}
            <DropdownMenuItem 
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-error hover:bg-error/5 focus:bg-error/10 focus:text-error rounded-xl cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 opacity-40" />
              {isArchived ? "Suppression" : "Supprimer"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <StudentModal 
        isOpen={showEdit} 
        onClose={() => setShowEdit(false)} 
        student={student} 
      />
      
      <DeleteConfirmModal 
        isOpen={showDelete} 
        onClose={() => setShowDelete(false)} 
        student={student} 
        isPermanent={isArchived}
      />
    </>
  );
}
