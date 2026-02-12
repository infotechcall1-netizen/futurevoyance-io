import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";
import OracleHeader from "./components/OracleHeader";
import AuthProvider from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Analytics />
          <div className="min-h-screen bg-slate-950 text-slate-50">
            <OracleHeader />
            <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
