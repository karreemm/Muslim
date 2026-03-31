import PrayerTimes from "./PrayTimes";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-[1500px] mx-auto min-h-screen flex justify-center items-center bg-background">
        <div className="w-full">
          <PrayerTimes />
        </div>
      </div>
    </>
  );
}
