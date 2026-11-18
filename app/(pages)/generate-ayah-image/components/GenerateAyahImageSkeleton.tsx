import { PageShell } from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GenerateAyahImageSkeleton() {
  return (
    <PageShell>
      <div className="animate-pulse">
        <Skeleton className="mb-3 h-10 w-64" />
        <Skeleton className="mb-8 h-5 w-96" />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/70 p-5">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/70 p-5">
            <Skeleton className="h-[560px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
