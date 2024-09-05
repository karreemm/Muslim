"use client";

import Navbar from "./Components/Navbar";
import HomeSection from "./Home/Home";

export default function Home() {

  return (
    <>
    <main className="bg-[#FFF5E4] text-teal-600 dark:bg-slate-900 dark:text-teal-500">
      <Navbar />
      <HomeSection />
    </main>
    </>
  );
}
