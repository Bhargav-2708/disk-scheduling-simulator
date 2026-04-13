import type { AlgorithmResult } from "@/lib/diskAlgorithms";
import { Trophy } from "lucide-react";

interface ComparisonTableProps {
  results: AlgorithmResult[];
}

const COLORS: Record<string, string> = {
  FCFS: "text-chart-fcfs",
  SSTF: "text-chart-sstf",
  SCAN: "text-chart-scan",
  "C-SCAN": "text-chart-cscan",
};

const ComparisonTable = ({ results }: ComparisonTableProps) => {
  if (results.length === 0) return null;

  const best = results.reduce((a, b) => (a.totalSeekTime < b.totalSeekTime ? a : b));

  return (
    <div className="glass-card rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground/90">Performance Metrics</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Comparison of total disk travel and efficiency</p>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-white/5">Algorithm</th>
              <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-white/5 text-right">Total Seek</th>
              <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-white/5 text-right">Avg Seek</th>
              <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-white/5 text-right">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((r) => {
              const isBest = r.name === best.name;
              return (
                <tr
                  key={r.name}
                  className={`group transition-all duration-300 hover:bg-white/5 ${isBest ? "bg-primary/5" : ""}`}
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-6 rounded-full ${isBest ? "bg-primary animate-pulse" : "bg-white/10"}`} />
                      <span className={`text-sm font-bold tracking-tight ${COLORS[r.name]}`}>
                        {r.name}
                      </span>
                      {isBest && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                          <Trophy className="w-3 h-3 text-primary" />
                          <span className="text-[9px] font-black uppercase tracking-tighter text-primary">Best</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right font-mono text-sm font-medium tracking-tight text-foreground/80 group-hover:text-primary transition-colors">
                    {r.totalSeekTime}
                  </td>
                  <td className="py-5 px-6 text-right font-mono text-sm font-medium tracking-tight text-foreground/80">
                    {r.averageSeekTime.toFixed(1)}
                  </td>
                  <td className="py-5 px-6 text-right font-mono text-sm font-black tracking-tight text-primary">
                    {(r.order.length / r.totalSeekTime * 100).toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
