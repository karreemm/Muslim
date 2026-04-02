import { BookCardSkeleton } from "./components/BookCardSkeleton";

export default function LoadingPage() {
  return (
    <div className="bg-background dark:bg-background min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
        <div className="h-10 w-64 bg-muted rounded-lg animate-pulse"></div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      </div>
    </div>
  );
}
