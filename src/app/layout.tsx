import type { Metadata } from "next";
import { Bebas_Neue, Cairo, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import "./rtl-support.css";

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vi2 — Live Well, Live Fully",
  description: "Dietary, wellness and sports nutrition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script id="vi2-language-init" strategy="beforeInteractive">
          {`
            try {
              var language = localStorage.getItem("vi2-language") === "ar" ? "ar" : "en";
              document.documentElement.lang = language;
              document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
              document.body && (document.body.dataset.locale = language);
            } catch (error) {}
          `}
        </Script>
      </head>

      <body
        className={`${bebasNeue.variable} ${inter.variable} ${cairo.variable}`}
        suppressHydrationWarning
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