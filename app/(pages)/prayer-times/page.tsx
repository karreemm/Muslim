import PrayerTimes from "./PrayTimes";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-[1500px] mx-auto min-h-screen flex justify-center items-center bg-[#FFF5E4] dark:bg-[#0f172a]">
        <div className="w-full">
          <PrayerTimes />
        </div>
      </div>
    </>
  );
}
