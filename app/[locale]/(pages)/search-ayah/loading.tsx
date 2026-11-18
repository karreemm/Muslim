import { AyahSearchCardSkeleton } from "./components/AyahSearchCardSkeleton";
import { PageShell } from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingSearchAyah() {
  return (
    <PageShell containerClassName="flex flex-col items-center gap-10">
      <div className="w-full">
        <div className="animate-pulse rounded-2xl border border-border bg-card p-3 shadow-lg sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>

      <div className="w-full rounded-2xl bg-background p-5">
        <div className="grid grid-cols-1 gap-5">
          <AyahSearchCardSkeleton />
          <AyahSearchCardSkeleton />
          <AyahSearchCardSkeleton />
        </div>
      </div>
    </PageShell>
  );
}
