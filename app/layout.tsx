import type { Metadata } from "next";
import { Cinzel, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Analytics from "./components/Analytics";
import SiteNavbar from "./components/SiteNavbar";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${cinzel.variable} antialiased fv-page`}
      >
        <AuthProvider>
          <Analytics />
          <div className="min-h-screen text-[#262626]">
            <div className="fv-symbol-layer" aria-hidden>
              <span className="fv-symbol fv-symbol-1">✶</span>
              <span className="fv-symbol fv-symbol-2">☉</span>
              <span className="fv-symbol fv-symbol-3">☽</span>
              <span className="fv-symbol fv-symbol-4">♄</span>
              <span className="fv-symbol fv-symbol-5">♃</span>
              <span className="fv-symbol fv-symbol-6">✦</span>
            </div>
            <SiteNavbar />
            <main className="fv-container mx-auto max-w-7xl px-6 pb-32 pt-8">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
