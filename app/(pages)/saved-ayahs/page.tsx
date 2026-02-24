import Table from "./Table";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

export default function App() {
  return (
    <>
      <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white flex flex-col ">
        <Table />
      </main>
    </>
  );
}
