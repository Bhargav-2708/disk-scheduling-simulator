import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { AlgorithmResult } from "@/lib/diskAlgorithms";

interface SeekChartProps {
  results: AlgorithmResult[];
}

const COLORS: Record<string, string> = {
  FCFS: "hsl(199, 89%, 48%)",
  SSTF: "hsl(172, 66%, 50%)",
  SCAN: "hsl(250, 60%, 55%)",
  "C-SCAN": "hsl(45, 93%, 58%)",
};

const SeekChart = ({ results }: SeekChartProps) => {
  if (results.length === 0) return null;

  const maxLen = Math.max(...results.map((r) => r.order.length));
  const data = Array.from({ length: maxLen }, (_, i) => {
    const point: Record<string, number> = { step: i };
    results.forEach((r) => {
      if (i < r.order.length) point[r.name] = r.order[i];
    });
    return point;
  });

  return (
    <div className="glass-card rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground/90">Head Movement Visualization</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Cylinder traversal over discrete steps</p>
        </div>
        <div className="flex gap-2">
          {results.map((r) => (
            <div key={r.name} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[r.name] }} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <defs>
              {results.map((r) => (
                <filter key={`glow-${r.name}`} id={`glow-${r.name}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="step"
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "rgba(10, 10, 20, 0.85)",
                backdropFilter: 'blur(10px)',
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: '12px 16px',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}
            />
            {results.map((r) => (
              <Line
                key={r.name}
                type="monotone"
                dataKey={r.name}
                stroke={COLORS[r.name]}
                strokeWidth={3}
                dot={{ r: 4, fill: COLORS[r.name], strokeWidth: 2, stroke: 'rgba(10,10,20,0.8)' }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#fff' }}
                animationDuration={800}
                filter={`url(#glow-${r.name})`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeekChart;
