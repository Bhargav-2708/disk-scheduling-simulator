import { useState, useCallback, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import SeekChart from "@/components/SeekChart";
import ComparisonTable from "@/components/ComparisonTable";
import StepByStep from "@/components/StepByStep";
import InfoDialog from "@/components/InfoDialog";
import { runAllAlgorithms, type AlgorithmResult } from "@/lib/diskAlgorithms";
import { HardDrive, ExternalLink, Cpu, Activity, BookOpen, Layers, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Index = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [apiStatus, setApiStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isAlgoHubOpen, setIsAlgoHubOpen] = useState(false);

  // ... (checkApiStatus useEffect stays same)
  const checkApiStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      if (response.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch {
      setApiStatus("offline");
    }
  }, []);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 5000);
    return () => clearInterval(interval);
  }, [checkApiStatus]);

  const handleRun = useCallback(async (requests: number[], head: number, diskSize: number) => {
    setIsSimulating(true);
    try {
      const response = await fetch("http://localhost:5000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests, head, diskSize }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success("Simulation Complete", {
          description: "Backend engine synchronized.",
        });
      } else {
        throw new Error();
      }
    } catch {
      toast.error("API Error", { description: "Using local engine fallback." });
      setResults(runAllAlgorithms(requests, head, diskSize));
    } finally {
      setIsSimulating(false);
    }
  }, []);

  const handleReset = useCallback(() => setResults([]), []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 relative overflow-x-hidden">
      <div className="neural-bg" />
      <div className="grid-pattern" />
      <div className="glow-mesh" />

      <header className="border-b border-white/5 py-4 px-6 backdrop-blur-xl sticky top-0 z-50 bg-background/40">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 premium-shadow">
              <HardDrive className="w-7 h-7 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight gradient-text">Disk Scheduling Simulator</h1>
              <p className="text-[13px] font-medium text-muted-foreground/80 lowercase tracking-widest">
                Real-time Head Traversal Engine
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span 
                    onClick={() => setIsDocOpen(true)}
                    className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group/link"
                  >
                    Documentation
                    <BookOpen className="w-3.5 h-3.5 text-primary/60 group-hover/link:text-primary" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>How to use this platform</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span 
                    onClick={() => setIsAlgoHubOpen(true)}
                    className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group/link"
                  >
                    Algorithm Hub
                    <Cpu className="w-3.5 h-3.5 text-primary/60 group-hover/link:text-primary" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Comparing strategies</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="h-4 w-px bg-white/10 mx-2" />
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 cursor-help transition-all">
                      <div className="relative flex h-2 w-2">
                        {apiStatus === "online" ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                        {apiStatus === "online" ? "API Live" : "Offline"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Backend Status</TooltipContent>
                </Tooltip>

                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] font-bold text-primary tracking-wider">
                  v1.2.0
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      {/* DOCUMENTATION DIALOG */}
      <InfoDialog 
        isOpen={isDocOpen} 
        onClose={() => setIsDocOpen(false)} 
        title="Documentation & Usage"
      >
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-primary">
              <Zap className="w-5 h-5" />
              <h4 className="text-lg font-bold">Getting Started</h4>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              This simulator allows you to visualize how Disk Controllers optimize the movement of the read/write head. 
              By reducing "Seek Time" (the movement across cylinders), performance is significantly boosted.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-3 text-primary">
              <Info className="w-5 h-5" />
              Core Concepts
            </h4>
            <div className="grid gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-foreground">Request Queue:</span>
                <p className="text-sm text-muted-foreground mt-1">Numerical cylinders the disk must visit (e.g., 98, 183, 37).</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-foreground">Initial Head:</span>
                <p className="text-sm text-muted-foreground mt-1">The starting position (cylinder) of the actuator arm.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-foreground">Total Seek Distance:</span>
                <p className="text-sm text-muted-foreground mt-1">The total cylinders traveled. Lower is better (higher efficiency).</p>
              </div>
            </div>
          </section>
        </div>
      </InfoDialog>

      {/* ALGORITHM HUB DIALOG */}
      <InfoDialog 
        isOpen={isAlgoHubOpen} 
        onClose={() => setIsAlgoHubOpen(false)} 
        title="Algorithm Hub"
      >
        <div className="space-y-10">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h5 className="font-black text-emerald-400 uppercase tracking-widest text-xs">Strategy 01</h5>
              <h4 className="text-xl font-bold">FCFS (First-Come, First-Served)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Processes requests exactly as they arrive. While fair and simple, it often results in heavy zigzagging and high seek times.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <h5 className="font-black text-blue-400 uppercase tracking-widest text-xs">Strategy 02</h5>
              <h4 className="text-xl font-bold">SSTF (Shortest Seek Time First)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always moves to the closest cylinder in the queue. Extremely efficient but can cause "starvation" for distant requests.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <h5 className="font-black text-purple-400 uppercase tracking-widest text-xs">Strategy 03</h5>
              <h4 className="text-xl font-bold">SCAN (Elevator Algorithm)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Moves in one direction to the end of the disk, then reverses. Provides a good balance of fairness and low seek overhead.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <h5 className="font-black text-amber-400 uppercase tracking-widest text-xs">Strategy 04</h5>
              <h4 className="text-xl font-bold">C-SCAN (Circular SCAN)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Moves in one direction only. When it reaches the end, it immediately wraps back to the start. Provides more uniform wait times.
              </p>
            </div>
          </div>
        </div>
      </InfoDialog>

      <main className="container max-w-7xl mx-auto px-6 py-12">
        {/* ... (rest of main stays same) */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-12">
          <aside className="space-y-8 animate-in slide-in-from-left duration-500 fade-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <InputPanel onRun={handleRun} onReset={handleReset} />
            </div>
          </aside>

          <div className="space-y-10 min-h-[600px] animate-in slide-in-from-right duration-700 fade-in">
            {isSimulating ? (
              <div className="flex flex-col items-center justify-center p-20 glass-card rounded-3xl border-primary/20 bg-primary/5 animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-ping" />
                  <HardDrive className="w-20 h-20 text-primary animate-bounce" />
                </div>
                <h3 className="mt-8 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">
                  SIMULATING...
                </h3>
                <p className="text-muted-foreground mt-3 font-medium tracking-wide">Synthesizing optimal seek patterns</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SeekChart results={results} />
                <div className="grid gap-10">
                  <ComparisonTable results={results} />
                  <StepByStep results={results} />
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-24 flex flex-col items-center justify-center text-center border-dashed border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 group animate-in fade-in zoom-in duration-1000">
                <div className="p-6 rounded-3xl bg-muted/20 mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  <HardDrive className="w-16 h-16 text-primary/40 group-hover:text-primary transition-colors duration-500" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground/90">Ready to Simulate</h3>
                <p className="text-lg text-muted-foreground/60 mt-4 max-w-sm mx-auto leading-relaxed">
                  Enter your disk cylinder requests to compare algorithmic strategies in real-time.
                </p>
                <div className="mt-8 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-[13px] font-bold text-primary animate-bounce">
                  Awaiting Input
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 backdrop-blur-xl mt-12 bg-black/20">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Disk Simulation Platform</p>
              <p className="text-[12px] text-muted-foreground/60">Open Source Visualization Engine</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Bhargav-2708" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <GitHubIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </a>
              <a 
                href="https://github.com/Bhargav-2708/disk-scheduling-simulator" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
              >
                <span className="text-sm font-bold text-primary">Star on GitHub</span>
                <Zap className="w-4 h-4 text-primary" />
              </a>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em]">
              Crafted by <span className="text-primary/60">Bhargav-2708</span> &copy; 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    stroke="none"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default Index;
