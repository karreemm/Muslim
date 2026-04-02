"use client";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import { usePathname } from "next/navigation";
import { AudioPlayer } from "../general/audio-player/AudioPlayer";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const listenQuranPage = currentPath.includes("listen-quran/reciter");


  return (
    <div
      className={`flex flex-col ${listenQuranPage ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <AudioPlayer />
      {!listenQuranPage && <Footer />}
    </div>
  );
}
