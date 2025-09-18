import Table from "./Table";
import Navbar from "../../Components/general/Navbar";
import Footer from "../../Components/general/Footer";

export default function App() {
  return (
    <>
      <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white flex flex-col ">
        <Navbar />
        <Table />
      </main>
      <Footer />
    </>
  );
}
