"use client";

import Navbar from "../../Components/general/Navbar";
import ReadQuran from "./ReadQuran";
import Footer from "../../Components/general/Footer";

export default function Home() {
  return (
    <>
      <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-white flex flex-col ">
        <Navbar />
        <ReadQuran />
      </main>
      <Footer />
    </>
  );
}
