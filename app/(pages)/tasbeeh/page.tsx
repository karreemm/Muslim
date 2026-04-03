"use client";

import Counter from "./Counter";

export default function App() {
  return (
    <div className="w-full relative min-h-screen bg-background text-foreground overflow-hidden">
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Counter />
      </main>
    </div>
  );
}