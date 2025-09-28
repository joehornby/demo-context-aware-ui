import type { Metadata } from "next";
import localFont from "next/font/local";
import { Azeret_Mono } from "next/font/google";
import "./globals.css";

const saans = localFont({
  src: "./fonts/SaansUprights-VF.woff2",
  weight: "300 700",
  variable: "--font-body",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Context Aware Interfaces",
  description: "Micro demos on the topic of context, intent and generative UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${saans.className} ${azeretMono.variable} antialiased bg-[#EAE5E3]`}
      >
        {children}
      </body>
    </html>
  );
}
