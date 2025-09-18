"use client";

import Counter from "./Counter";
import Navbar from "../../Components/general/Navbar";
import Footer from "../../Components/general/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="w-full relative min-h-screen flex flex-col items-center  bg-[#FFF5E4] text-[#134B70] dark:bg-slate-900 dark:text-white">
        <div className="mt-28">
          <Counter />
        </div>
      </div>
      <Footer />
    </>
  );
}
