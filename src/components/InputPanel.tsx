import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shuffle, RotateCcw, Play } from "lucide-react";

interface InputPanelProps {
  onRun: (requests: number[], head: number, diskSize: number) => void;
  onReset: () => void;
}

const InputPanel = ({ onRun, onReset }: InputPanelProps) => {
  const [requestQueue, setRequestQueue] = useState("98, 183, 37, 122, 14, 124, 65, 67");
  const [headPosition, setHeadPosition] = useState("53");
  const [diskSize, setDiskSize] = useState("200");

  const handleRun = () => {
    const requests = requestQueue
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    const head = parseInt(headPosition) || 0;
    const size = parseInt(diskSize) || 200;
    if (requests.length === 0) return;
    onRun(requests, head, size);
  };

  const handleRandom = () => {
    const size = parseInt(diskSize) || 200;
    const count = 8 + Math.floor(Math.random() * 8);
    const reqs = Array.from({ length: count }, () => Math.floor(Math.random() * size));
    setRequestQueue(reqs.join(", "));
    setHeadPosition(String(Math.floor(Math.random() * size)));
  };

  const handleReset = () => {
    setRequestQueue("");
    setHeadPosition("53");
    setDiskSize("200");
    onReset();
  };

  return (
    <div className="glass-card rounded-3xl p-8 space-y-8 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-foreground/90">Configuration</h2>
        <div className="w-8 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2.5">
          <Label htmlFor="queue" className="text-[13px] font-bold text-muted-foreground/80 uppercase tracking-widest ml-1">
            Request Queue
          </Label>
          <div className="relative group">
            <Input
              id="queue"
              value={requestQueue}
              onChange={(e) => setRequestQueue(e.target.value)}
              placeholder="e.g. 98, 183, 37, 122, 14"
              className="bg-white/5 border-white/10 h-12 focus:ring-primary/20 transition-all rounded-xl pl-4 group-hover:border-primary/30"
            />
            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <Label htmlFor="head" className="text-[13px] font-bold text-muted-foreground/80 uppercase tracking-widest ml-1">
              Initial Head
            </Label>
            <Input
              id="head"
              type="number"
              value={headPosition}
              onChange={(e) => setHeadPosition(e.target.value)}
              className="bg-white/5 border-white/10 h-12 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="size" className="text-[13px] font-bold text-muted-foreground/80 uppercase tracking-widest ml-1">
              Disk Size
            </Label>
            <Input
              id="size"
              type="number"
              value={diskSize}
              onChange={(e) => setDiskSize(e.target.value)}
              className="bg-white/5 border-white/10 h-12 focus:ring-primary/20 transition-all rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <Button 
          onClick={handleRun} 
          className="h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20 rounded-2xl"
        >
          <Play className="w-5 h-5 mr-3 fill-current" /> Run Simulation
        </Button>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleRandom} 
            variant="outline" 
            className="h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary transition-all rounded-xl font-bold"
          >
            <Shuffle className="w-4 h-4 mr-2" /> Randomize
          </Button>
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="h-12 border-white/10 bg-white/5 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all rounded-xl font-bold"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
