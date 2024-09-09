import ListenQuranPage from "./ListenQuran";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function App() {
    return (
        <>
        <div className="flex flex-col min-h-screen bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
            <Navbar />
            <ListenQuranPage />
        </div>
        <Footer />
        </>
    );
}