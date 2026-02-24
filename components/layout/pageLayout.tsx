"use client"; 

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function PageLayout({ children }: { children: React.ReactNode }) {

    const currentPath = usePathname();
    const listenQuranPage = currentPath.includes("listen-quran");

    return (
        <div className={`flex flex-col ${listenQuranPage ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
            <Navbar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            {!listenQuranPage && <Footer />}
        </div>
    );
}