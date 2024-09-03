import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Muslim",
  description: "Muslim is a website for all Muslims",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
