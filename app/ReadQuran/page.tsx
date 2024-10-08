"use client";

import Navbar from "../Components/Navbar";
import ReadQuran from "./ReadQuran";
import Footer from "../Components/Footer";

export default function Home() {

  return (
    <>
    <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500 flex flex-col ">
      <Navbar />
      <ReadQuran />
    </main>
    <Footer />

    </>
  );
}
