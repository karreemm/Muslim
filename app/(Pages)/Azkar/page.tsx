import ReadAzkar from "./Azkar";
import Navbar from "../../../components/general/Navbar";
import Footer from "../../../components/general/Footer";

export default function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <Navbar />
        <ReadAzkar />
      </div>
      <Footer />
    </>
  );
}
