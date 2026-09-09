import type { Metadata } from "next";
import {
  Bebas_Neue,
  Cairo,
  Inter,
} from "next/font/google";

import "./globals.css";
import "./rtl-support.css";

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cairo = Cairo({
  subsets: [
    "arabic",
    "latin",
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Vi2 — Live Well, Live Fully",
  description:
    "Dietary, wellness and sports nutrition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${inter.variable} ${cairo.variable}`}
      >
        <Providers>
          <Navbar />

          {children}

          <Footer />

          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
