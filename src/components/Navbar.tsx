"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { itemCount, openCart } = useCart();

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <header className={styles.header}>
        {/* TOP ANNOUNCEMENT BAR */}
        <div className={styles.announcement}>
          FREE SHIPPING ON ORDERS OVER 2,500 EGP
        </div>

        {/* MAIN NAVIGATION */}
        <div className={styles.navigation}>
          <div className={styles.navInner}>
            {/* LEFT SIDE */}
            <nav className={styles.leftNav}>
              <Link href="/shop">
                SHOP
              </Link>

              <Link href="/shop?category=Wellness">
                WELLNESS
              </Link>

              <Link href="/shop?category=Protein">
                PROTEIN
              </Link>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              className={styles.mobileMenuButton}
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu
                size={21}
                strokeWidth={1.45}
              />
            </button>

            {/* CENTER LOGO */}
            <Link
              href="/"
              className={styles.logo}
              aria-label="Vi2 home"
            >
              <Image
                src="/brand/vi2-logo-mark-black.png"
                alt="Vi2"
                width={50}
                height={64}
                priority
              />
            </Link>

            {/* RIGHT SIDE */}
            <div className={styles.rightSide}>
              <nav className={styles.rightNav}>
                <Link href="/shop?category=Vitamins">
                  VITAMINS
                </Link>

                <Link href="/shop">
                  BUNDLES
                </Link>
              </nav>

              <div className={styles.actions}>
                <Link
                  href="/shop"
                  className={styles.iconButton}
                  aria-label="Search"
                >
                  <Search
                    size={17}
                    strokeWidth={1.4}
                  />
                </Link>

                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.accountButton}`}
                  aria-label="Account"
                >
                  <UserRound
                    size={17}
                    strokeWidth={1.4}
                  />
                </button>

                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.cartButton}`}
                  aria-label="Open cart"
                  onClick={openCart}
                >
                  <ShoppingBag
                    size={17}
                    strokeWidth={1.4}
                  />

                  {itemCount > 0 && (
                    <span className={styles.cartCount}>
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={
          mobileOpen
            ? `${styles.mobileMenu} ${styles.mobileMenuOpen}`
            : styles.mobileMenu
        }
      >
        <div className={styles.mobileMenuHeader}>
          <Link
            href="/"
            className={styles.mobileLogo}
            onClick={closeMobileMenu}
            aria-label="Vi2 home"
          >
            <Image
              src="/brand/vi2-logo-lockup-black.png"
              alt="Vi2 — Live Well, Live Fully"
              width={74}
              height={116}
              priority
            />
          </Link>

          <button
            type="button"
            className={styles.mobileClose}
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <X
              size={23}
              strokeWidth={1.4}
            />
          </button>
        </div>

        <nav className={styles.mobileLinks}>
          <Link
            href="/shop"
            onClick={closeMobileMenu}
          >
            <span>01</span>
            Shop
          </Link>

          <Link
            href="/shop?category=Wellness"
            onClick={closeMobileMenu}
          >
            <span>02</span>
            Wellness
          </Link>

          <Link
            href="/shop?category=Protein"
            onClick={closeMobileMenu}
          >
            <span>03</span>
            Protein
          </Link>

          <Link
            href="/shop?category=Vitamins"
            onClick={closeMobileMenu}
          >
            <span>04</span>
            Vitamins
          </Link>

          <Link
            href="/shop"
            onClick={closeMobileMenu}
          >
            <span>05</span>
            Bundles
          </Link>
        </nav>

        <div className={styles.mobileBottom}>
          <span>VI2</span>
          <span>LIVE WELL, LIVE FULLY.</span>
        </div>
      </div>
    </>
  );
}