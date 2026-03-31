"use client";

import Counter from "./Counter";

export default function App() {
  return (
    <>
      <div className="w-full relative min-h-screen flex flex-col items-center  bg-background text-foreground dark:bg-background dark:text-foreground">
        <div className="mt-10">
          <Counter />
        </div>
      </div>
    </>
  );
}
