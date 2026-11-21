"use client";

import dynamic from "next/dynamic";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import { usePathname } from "next/navigation";
import { useRadioPlayer } from "@/hooks/radio";

const AudioPlayer = dynamic(
  () =>
    import("../general/audio-player/AudioPlayer").then((module) => module.AudioPlayer),
  { ssr: false },
);

const RadioPlayer = dynamic(() => import("../general/radio-player/RadioPlayer"), {
  ssr: false,
});

export default function PageLayout({ children }: { children: React.ReactNode }) {
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
