import PrayerTimes from "./PrayTimes";
import Navbar from "../../../components/general/Navbar";
import Footer from "../../../components/general/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex justify-center items-center bg-[#FFF5E4] dark:bg-[#0f172a]">
        <div className="w-full">
          <PrayerTimes />
        </div>
      </div>
      <Footer />
    </>
  );
}
