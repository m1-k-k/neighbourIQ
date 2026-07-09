import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MobileScenarioBar } from "@/components/layout/MobileScenarioBar";
import { ScenarioProvider } from "@/lib/ScenarioContext";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeighbourIQ — stop community crises before they start",
  description:
    "AI Community Guardian for councils: predict flood, traffic, and incident risk — and protect vulnerable residents before problems escalate.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-mist font-sans text-ink">
        <ScenarioProvider>
          {children}
          <MobileScenarioBar />
        </ScenarioProvider>
        <Analytics />
      </body>
    </html>
  );
}
