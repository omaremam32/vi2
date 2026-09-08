import type { Metadata } from "next";
import {
  Bebas_Neue,
  Inter,
} from "next/font/google";

import "./globals.css";

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

export const metadata: Metadata = {
  title: "Vi2 — Live Well, Live Fully",
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
        className={`${bebasNeue.variable} ${inter.variable}`}
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