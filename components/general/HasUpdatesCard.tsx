"use client";

import { RefreshCw, Home } from "lucide-react";

interface HasUpdatesCardProps {
  mounted: boolean;
  title: string;
  message: string;
  backToHomeLabel: string;
  onBackToHome: () => void;
}

export default function HasUpdatesCard({
  mounted,
  title,
  message,
  backToHomeLabel,
  onBackToHome,
}: HasUpdatesCardProps) {
  return (
    <div className="min-h-screen bg-background pb-16 pt-8 text-foreground lg:pt-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-secondary/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`
          mx-auto w-[92%] max-w-2xl relative z-10
          transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
        `}
      >
        <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw
              className="w-10 h-10 text-primary animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h1 className="text-3xl font-bold lg:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            {title}
          </h1>

          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            {message}
          </p>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            <Home className="w-5 h-5" />
            {backToHomeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
