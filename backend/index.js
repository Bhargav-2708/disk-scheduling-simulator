const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Disk Scheduling Algorithms
function fcfs(requests, head) {
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

function sstf(requests, head) {
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

function scan(requests, head, diskSize) {
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

function cscan(requests, head, diskSize) {
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

app.post('/api/simulate', (req, res) => {
  const { requests, head, diskSize } = req.body;

  if (!requests || head === undefined || !diskSize) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const results = [
    fcfs(requests, head),
    sstf(requests, head),
    scan(requests, head, diskSize),
    cscan(requests, head, diskSize),
  ];

  res.json(results);
});

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
