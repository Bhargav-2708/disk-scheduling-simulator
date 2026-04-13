import * as React from "react";
import { X } from "lucide-react";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoDialog = ({ isOpen, onClose, title, children }: InfoDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-background/20" 
        onClick={onClose}
      />
      <div className="glass-card relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-400">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
        
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
          <h2 className="text-2xl font-extrabold tracking-tight gradient-text">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:rotate-90"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-8 py-8 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
