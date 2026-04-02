import { AyahSearchCardSkeleton } from "./components/AyahSearchCardSkeleton";

export default function LoadingSearchAyah() {
  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col items-center gap-10 mt-32">
      <div className="w-[90%] mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-3 sm:p-6 border border-border animate-pulse">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 bg-muted rounded"></div>
            <div className="flex-1 h-10 bg-muted rounded"></div>
            <div className="w-20 h-10 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="w-[90%] bg-background dark:bg-background p-5 rounded-lg">
        <div className="grid grid-cols-1 gap-5">
          <AyahSearchCardSkeleton />
          <AyahSearchCardSkeleton />
          <AyahSearchCardSkeleton />
        </div>
      </div>
    </div>
  );
}
