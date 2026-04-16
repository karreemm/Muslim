export default function GenerateAyahImageSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="w-[92%] max-w-7xl mx-auto pt-10 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg mb-3" />
        <div className="h-5 w-96 bg-muted rounded-lg mb-8" />

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="bg-card/70 border border-border/50 rounded-2xl p-5 space-y-4">
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
          </div>

          <div className="bg-card/70 border border-border/50 rounded-2xl p-5">
            <div className="h-[560px] w-full bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
