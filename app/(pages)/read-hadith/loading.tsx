import { BookCardSkeleton } from "./components/BookCardSkeleton";

export default function LoadingPage() {
  return (
    <div className="bg-[#FFF5E4] dark:bg-slate-900 min-h-screen w-full flex justify-center">
      <div className="w-[95%] mt-32 flex flex-col items-center gap-10">
        <div className="h-10 w-64 bg-gray-300 dark:bg-slate-700 rounded-lg animate-pulse"></div>

        <div className="w-full max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
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
