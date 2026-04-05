import { HadithCardSkeleton } from "../../../../components/HadithCardSkeleton";

export default function LoadingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="relative z-10 w-[92%] max-w-7xl mx-auto pt-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-2 h-10 w-64 rounded-lg bg-muted/50 animate-pulse" />
          <div className="mx-auto mb-2 h-5 w-36 rounded-lg bg-muted/30 animate-pulse" />
          <div className="mx-auto h-4 w-48 rounded-lg bg-muted/20 animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <div className="h-20 rounded-2xl bg-muted/40 animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <HadithCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
