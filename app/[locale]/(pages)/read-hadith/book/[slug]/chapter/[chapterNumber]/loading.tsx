import { HadithCardSkeleton } from "../../../../components/HadithCardSkeleton";
import { PageShell } from "@/components/ui/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <PageShell>
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-64" />
        <Skeleton className="mx-auto mb-2 h-5 w-36" />
        <Skeleton className="mx-auto h-4 w-48" />
      </div>

      <div className="mx-auto mb-10 max-w-4xl">
        <Skeleton className="h-20 rounded-2xl" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {[...Array(3)].map((_, index) => (
          <HadithCardSkeleton key={index} />
        ))}
      </div>
    </PageShell>
  );
}
