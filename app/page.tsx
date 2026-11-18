"use client";

import HomeSection from "./(pages)/home/Home";
import "./globals.css";

export default function Home() {
  return (
    <>
      <main className="bg-background relative flex min-h-screen flex-col gap-5 text-foreground">
        <HomeSection />
        <div className="h-20"></div>
      </main>
    </>
  );
}
