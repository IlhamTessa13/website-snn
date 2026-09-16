import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Analisis Ekonomi Jawa Tengah 2016–2025 | Scrollytelling Interaktif",
  description:
    "Eksplorasi interaktif disparitas PDRB, pertumbuhan ekonomi, dan dinamika sektoral 35 kabupaten/kota di Provinsi Jawa Tengah melalui data journalism scrollytelling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Bungee+Tint&family=Delius&family=Indie+Flower&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
