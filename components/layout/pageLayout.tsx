"use client";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import { usePathname } from "next/navigation";
import { AudioPlayer } from "../general/audio-player/AudioPlayer";
import RadioPlayer from "../general/radio-player/RadioPlayer";
import { useRadioPlayer } from "@/hooks/radio";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const listenQuranPage = currentPath.includes("listen-quran/reciter");
  const { currentStation } = useRadioPlayer();
  const isRadioActive = !!currentStation;

  return (
    <div
      className={`flex flex-col ${listenQuranPage ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      {!isRadioActive && <AudioPlayer />}
      {isRadioActive && <RadioPlayer />}
      {!listenQuranPage && <Footer />}
    </div>
  );
}
