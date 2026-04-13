# Disk Scheduling Simulator

A modern, interactive web application to visualize and compare various disk scheduling algorithms. Built with React, TypeScript, Tailwind CSS, and Recharts.

## 🚀 Features

- **Real-time Visualization**: Interactive line charts showing head movements across cylinders.
- **Multiple Algorithms**: Compare standard scheduling strategies:
  - **FCFS** (First-Come, First-Served)
  - **SSTF** (Shortest Seek Time First)
  - **SCAN** (Elevator Algorithm)
  - **C-SCAN** (Circular SCAN)
- **Performance Analysis**: Detailed comparison table showing total seek time, average seek time, and throughput.
- **Step-by-Step Breakdown**: Detailed execution sequence for each algorithm.
- **Randomization**: Quickly generate random request queues for testing.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or the next available port).

## 📄 License

MIT
