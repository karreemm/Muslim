import PrayerTimes from "./PrayTimes";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

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