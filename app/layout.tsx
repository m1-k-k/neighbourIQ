import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScenarioProvider } from "@/lib/ScenarioContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeighbourIQ — AI Community Guardian",
  description: "Predicting and preventing community problems before they happen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-100 text-slate-900">
        <ScenarioProvider>{children}</ScenarioProvider>
        <Analytics />
      </body>
    </html>
  );
}
