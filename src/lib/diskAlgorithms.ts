export interface AlgorithmResult {
  name: string;
  order: number[];
  totalSeekTime: number;
  averageSeekTime: number;
  seekSequence: number[];
}

export function fcfs(requests: number[], head: number): AlgorithmResult {
  const order = [head, ...requests];
  let total = 0;
  for (let i = 1; i < order.length; i++) {
    total += Math.abs(order[i] - order[i - 1]);
  }
  return {
    name: "FCFS",
    order,
    totalSeekTime: total,
    averageSeekTime: total / (requests.length || 1),
    seekSequence: order,
  };
}

export function sstf(requests: number[], head: number): AlgorithmResult {
  const remaining = [...requests];
  const order = [head];
  let current = head;
  let total = 0;

  while (remaining.length > 0) {
    let minDist = Infinity;
    let minIdx = 0;
    for (let i = 0; i < remaining.length; i++) {
      const dist = Math.abs(remaining[i] - current);
      if (dist < minDist) {
        minDist = dist;
        minIdx = i;
      }
    }
    total += minDist;
    current = remaining[minIdx];
    order.push(current);
    remaining.splice(minIdx, 1);
  }

  return {
    name: "SSTF",
    order,
    totalSeekTime: total,
    averageSeekTime: total / (requests.length || 1),
    seekSequence: order,
  };
}

export function scan(requests: number[], head: number, diskSize: number): AlgorithmResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  const order = [head, ...right, diskSize - 1, ...left.reverse()];
  let total = 0;
  for (let i = 1; i < order.length; i++) {
    total += Math.abs(order[i] - order[i - 1]);
  }

  return {
    name: "SCAN",
    order,
    totalSeekTime: total,
    averageSeekTime: total / (requests.length || 1),
    seekSequence: order,
  };
}

export function cscan(requests: number[], head: number, diskSize: number): AlgorithmResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < head);
  const right = sorted.filter((r) => r >= head);

  const order = [head, ...right, diskSize - 1, 0, ...left];
  let total = 0;
  for (let i = 1; i < order.length; i++) {
    total += Math.abs(order[i] - order[i - 1]);
  }

  return {
    name: "C-SCAN",
    order,
    totalSeekTime: total,
    averageSeekTime: total / (requests.length || 1),
    seekSequence: order,
  };
}

export function runAllAlgorithms(requests: number[], head: number, diskSize: number): AlgorithmResult[] {
  return [
    fcfs(requests, head),
    sstf(requests, head),
    scan(requests, head, diskSize),
    cscan(requests, head, diskSize),
  ];
}
