"use client";

import Navbar from "./Components/Navbar";
import HomeSection from "./Home/Home";
import Footer from "./Components/Footer";

export default function Home() {

  return (
    <>
    <main className="bg-[#FFF5E4] min-h-screen text-teal-600 dark:bg-slate-900 dark:text-teal-500">
      <Navbar />
      <HomeSection />
    </main>
    <Footer />
    </>
  );
}
