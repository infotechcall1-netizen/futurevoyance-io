import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";
import SiteHeader from "./components/SiteHeader";
import AuthProvider from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FutureVoyance • Oracle IA vivant",
  description:
    "Oracle IA ésotérique qui se souvient de tes dates, cycles et rituels pour t'offrir un message juste, au bon moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          <Analytics />
          <div className="min-h-screen text-[#1A1A1A]">
            <SiteHeader />
            <main className="mx-auto max-w-7xl px-6 pb-32 pt-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
