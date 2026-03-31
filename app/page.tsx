"use client";

import HomeSection from "./(pages)/home/Home";
import "./globals.css";

export default function Home() {
  return (
    <>
      <main className="bg-background relative flex flex-col gap-5 min-h-screen text-primary dark:bg-background dark:text-foreground">
        <HomeSection />
        <div className="h-20"></div>
      </main>
    </>
  );
}
