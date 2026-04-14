import { useState } from "react";
import type { AlgorithmResult } from "@/lib/diskAlgorithms";
import { ChevronDown } from "lucide-react";

interface StepByStepProps {
  results: AlgorithmResult[];
}

const TEXT_COLORS: Record<string, string> = {
  FCFS: "text-chart-fcfs",
  SSTF: "text-chart-sstf",
  SCAN: "text-chart-scan",
  "C-SCAN": "text-chart-cscan",
};

const DESCRIPTIONS: Record<string, string> = {
  FCFS: "Processes requests in the order they arrive. Simple but may cause high seek times.",
  SSTF: "Always moves to the nearest request. Reduces seek time but may cause starvation.",
  SCAN: "Moves in one direction servicing requests, then reverses. Like an elevator.",
  "C-SCAN": "Moves in one direction, then jumps to the start. Provides more uniform wait times.",
};

const StepByStep = ({ results }: StepByStepProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (results.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground/90">Algorithm Breakdown</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Detailed execution sequence and seek distances</p>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.name} className={`rounded-2xl border transition-all duration-300 ${expanded === r.name ? "bg-white/5 border-white/10 ring-1 ring-primary/20 shadow-2xl" : "bg-white/2 border-white/5 hover:bg-white/5"}`}>
            <button
              onClick={() => setExpanded(expanded === r.name ? null : r.name)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs tracking-tighter shadow-sm ${TEXT_COLORS[r.name]} bg-white/5 border border-white/5`}>
                  {r.name.substring(0, 2)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-extrabold tracking-tight ${TEXT_COLORS[r.name]}`}>
                      {r.name} Strategy
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground/80 mt-1 max-w-sm">
                    {DESCRIPTIONS[r.name]}
                  </p>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-white/5 border border-white/10 transition-transform duration-300 ${expanded === r.name ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
            
            {expanded === r.name && (
              <div className="px-5 pb-6 animate-in slide-in-from-top-2 duration-300">
                <div className="pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-2 items-center">
                    {r.order.map((pos, i) => (
                      <div key={i} className="flex items-center">
                        <div className="relative group">
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-tighter ${TEXT_COLORS[r.name]} bg-white/5 border border-white/5 transition-all hover:border-primary/50 cursor-default`}>
                            {pos}
                          </div>
                          {i === 0 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-primary text-[8px] font-black uppercase text-white tracking-widest leading-none">
                              Start
                            </div>
                          )}
                        </div>
                        {i < r.order.length - 1 && (
                          <div className="flex flex-col items-center mx-2 opacity-40">
                            <div className="w-4 h-[1px] bg-muted-foreground" />
                            <span className="text-[9px] font-bold mt-1 text-muted-foreground font-mono">
                              {Math.abs(r.order[i + 1] - r.order[i])}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between px-3 py-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Execution Summary</div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Total Steps</span>
                        <span className="text-sm font-black font-mono">{r.order.length}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Net Distance</span>
                        <span className="text-sm font-black font-mono text-primary">{r.totalSeekTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepByStep;
