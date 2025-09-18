import ReadHadithPage from "./ReadHadith";
import Navbar from "../../Components/general/Navbar";
import Footer from "../../Components/general/Footer";

export default function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <Navbar />
        <ReadHadithPage />
      </div>
      <Footer />
    </>
  );
}
