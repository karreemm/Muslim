import Table from "./Table";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function App() {
    return (
      <>
        <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 flex flex-col ">
          <Navbar />
          <Table />
        </main>
        <Footer />
      </>
    );
}