"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgePercent,
  ChevronDown,
  ChevronRight,
  Globe2,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import GlobalSearch from "@/components/GlobalSearch";
import MobileBottomNav from "@/components/MobileBottomNav";
import DesktopMegaMenu, { type MegaMenuKey } from "@/components/DesktopMegaMenu";
import AccountDropdown from "@/components/AccountDropdown";
import { useCart } from "@/context/CartContext";

import styles from "./Navbar.module.css";

type Vi2Language =
  | "en"
  | "ar";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [language, setLanguage] =
    useState<Vi2Language>("en");

  const [megaOpen, setMegaOpen] =
    useState<MegaMenuKey | null>(null);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const {
    itemCount,
    openCart,
  } = useCart();

  const isArabic =
    language === "ar";

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          "vi2-language",
        );

      if (
        saved === "en" ||
        saved === "ar"
      ) {
        setLanguage(saved);
      }
    } catch {
      // English remains fallback.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language;

    document.documentElement.dir =
      isArabic
        ? "rtl"
        : "ltr";

    document.body.dataset.locale =
      language;

    try {
      window.localStorage.setItem(
        "vi2-language",
        language,
      );
    } catch {
      // Keep current visit language.
    }
  }, [
    isArabic,
    language,
  ]);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);


  useEffect(() => {
    try {
      const shouldOpenSearch =
        window.sessionStorage.getItem(
          "vi2-open-global-search",
        );

      if (
        shouldOpenSearch ===
        "1"
      ) {
        window.sessionStorage.removeItem(
          "vi2-open-global-search",
        );

        window.setTimeout(
          () => {
            setSearchOpen(true);
          },
          40,
        );
      }
    } catch {
      // Search remains available from the header.
    }
  }, []);

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      setMenuOpen(false);
      setSearchOpen(false);
      setMegaOpen(null);
      setAccountOpen(false);
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function openSearch() {
    setMenuOpen(false);
    setMegaOpen(null);
    setAccountOpen(false);
    setSearchOpen(true);
  }

  const copy = isArabic
    ? {
        freeShipping:
          "شحن مجاني للطلبات فوق ٢٬٥٠٠ جنيه",
        flash:
          "العروض اليومية",
        search:
          "ابحث في Vi2",
        account:
          "الحساب",
        signIn:
          "تسجيل الدخول",
        categories:
          "التسوق",
        supplements:
          "المكملات",
        sports:
          "التغذية الرياضية",
        vitamins:
          "الفيتامينات والمعادن",
        wellness:
          "العافية",
        beauty:
          "الجمال والعافية",
        kids:
          "الأطفال",
        brands:
          "العلامات التجارية",
        health:
          "الأهداف الصحية",
        deals:
          "العروض",
        best:
          "الأكثر مبيعاً",
        new:
          "جديد",
        bundles:
          "الباقات",
        welcome:
          "مرحباً!",
        shopBy:
          "تسوق حسب",
        orders:
          "طلباتي",
        rewards:
          "مكافآتي",
        create:
          "تسجيل الدخول / إنشاء حساب",
        menu:
          "القائمة",
        cart:
          "السلة",
      }
    : {
        freeShipping:
          "FREE SHIPPING ON ORDERS OVER 2,500 EGP",
        flash:
          "DAILY FLASH DEALS",
        search:
          "Search all of Vi2",
        account:
          "ACCOUNT",
        signIn:
          "SIGN IN",
        categories:
          "SHOP",
        supplements:
          "Supplements",
        sports:
          "Sports Nutrition",
        vitamins:
          "Vitamins & Minerals",
        wellness:
          "Wellness",
        beauty:
          "Beauty & Wellness",
        kids:
          "Baby & Kids",
        brands:
          "Brands",
        health:
          "Health Goals",
        deals:
          "Deals",
        best:
          "Best Sellers",
        new:
          "New",
        bundles:
          "Bundles",
        welcome:
          "Welcome!",
        shopBy:
          "SHOP BY",
        orders:
          "My Orders",
        rewards:
          "My Rewards",
        create:
          "SIGN IN / CREATE ACCOUNT",
        menu:
          "Menu",
        cart:
          "Cart",
      };

  const drawerCategories = [
    {
      label:
        copy.supplements,
      href:
        "/shop",
    },
    {
      label:
        copy.sports,
      href:
        "/shop?goal=Muscle%20%26%20Recovery",
    },
    {
      label:
        copy.vitamins,
      href:
        "/shop?category=Vitamins",
    },
    {
      label:
        copy.wellness,
      href:
        "/shop?category=Wellness",
    },
  ];

  return (
    <>
      <header
        className={styles.header}
        onMouseLeave={() =>
          setMegaOpen(null)
        }
      >
        {/* ======================================================
            DESKTOP UTILITY STRIP
            ====================================================== */}
        <div className={styles.utilityStrip}>
          <div className={styles.utilityInner}>
            <div className={styles.utilityLeft}>
              <Link href="/#flash-deals">
                <BadgePercent
                  size={14}
                  strokeWidth={1.45}
                />

                <span>
                  {copy.flash}
                </span>

                <strong>
                  24H PICKS
                </strong>

                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                />
              </Link>

              <span
                className={
                  styles.utilityDivider
                }
              />

              <span
                className={
                  styles.shippingText
                }
              >
                {copy.freeShipping}
              </span>
            </div>

            <div className={styles.utilityRight}>
              <Globe2
                size={15}
                strokeWidth={1.4}
              />

              <span>EG</span>

              <span
                className={
                  styles.utilityDivider
                }
              />

              <button
                type="button"
                onClick={() =>
                  setLanguage(
                    isArabic
                      ? "en"
                      : "ar",
                  )
                }
              >
                {isArabic
                  ? "EN"
                  : "AR"}
              </button>

              <span
                className={
                  styles.utilityDivider
                }
              />

              <strong>
                EGP
              </strong>
            </div>
          </div>
        </div>

        {/* MOBILE PROMO BAR */}
        <div className={styles.mobileAnnouncement}>
          {copy.freeShipping}
        </div>

        {/* ======================================================
            MAIN DESKTOP / MOBILE HEADER
            ====================================================== */}
        <div className={styles.mainBar}>
          <div className={styles.mainInner}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              aria-label={copy.menu}
              onClick={() =>
                setMenuOpen(true)
              }
            >
              <Menu
                size={23}
                strokeWidth={1.45}
              />
            </button>

            <Link
              href="/"
              className={styles.logo}
              aria-label="Vi2 home"
            >
              <Image
                src="/brand/vi2-logo-mark-black.png"
                alt="Vi2"
                width={58}
                height={70}
                priority
              />
            </Link>

            <button
              type="button"
              className={styles.searchBar}
              onClick={openSearch}
              aria-label="Search Vi2"
            >
              <span>
                {copy.search}
              </span>

              <Search
                size={22}
                strokeWidth={1.45}
              />
            </button>

            <div
              className={styles.accountWrap}
              onMouseEnter={() => {
                setMegaOpen(null);
                setAccountOpen(true);
              }}
              onMouseLeave={() =>
                setAccountOpen(false)
              }
            >
              <button
                type="button"
                className={styles.account}
                aria-expanded={accountOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setMegaOpen(null);
                  setAccountOpen(
                    (current) => !current,
                  );
                }}
              >
                <UserRound
                  size={21}
                  strokeWidth={1.4}
                />

                <div>
                  <span>
                    {copy.account}
                  </span>

                  <strong>
                    {copy.signIn}
                  </strong>
                </div>

                <ChevronDown
                  className={styles.accountChevron}
                  size={14}
                  strokeWidth={1.5}
                />
              </button>

              <AccountDropdown
                open={accountOpen}
                isArabic={isArabic}
                onClose={() =>
                  setAccountOpen(false)
                }
              />
            </div>

            <button
              type="button"
              className={styles.cart}
              aria-label={copy.cart}
              onClick={openCart}
            >
              <ShoppingBag
                size={24}
                strokeWidth={1.4}
              />

              {itemCount > 0 && (
                <span
                  className={
                    styles.cartCount
                  }
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================
            DESKTOP CATEGORY ROW
            ====================================================== */}
        <nav className={styles.desktopCategories}>
          <div className={styles.categoryInner}>
            <div className={styles.categoryMain}>
              <button
                type="button"
                className={
                  megaOpen === "supplements"
                    ? styles.categoryTriggerActive
                    : styles.categoryTrigger
                }
                onMouseEnter={() =>
                  setMegaOpen("supplements")
                }
                onFocus={() =>
                  setMegaOpen("supplements")
                }
                onClick={() =>
                  setMegaOpen(
                    megaOpen === "supplements"
                      ? null
                      : "supplements",
                  )
                }
              >
                {copy.supplements}
              </button>

              <button
                type="button"
                className={
                  megaOpen === "sports"
                    ? styles.categoryTriggerActive
                    : styles.categoryTrigger
                }
                onMouseEnter={() =>
                  setMegaOpen("sports")
                }
                onFocus={() =>
                  setMegaOpen("sports")
                }
                onClick={() =>
                  setMegaOpen(
                    megaOpen === "sports"
                      ? null
                      : "sports",
                  )
                }
              >
                {copy.sports}
              </button>

              <button
                type="button"
                className={
                  megaOpen === "vitamins"
                    ? styles.categoryTriggerActive
                    : styles.categoryTrigger
                }
                onMouseEnter={() =>
                  setMegaOpen("vitamins")
                }
                onFocus={() =>
                  setMegaOpen("vitamins")
                }
                onClick={() =>
                  setMegaOpen(
                    megaOpen === "vitamins"
                      ? null
                      : "vitamins",
                  )
                }
              >
                {copy.vitamins}
              </button>

              <button
                type="button"
                className={
                  megaOpen === "wellness"
                    ? styles.categoryTriggerActive
                    : styles.categoryTrigger
                }
                onMouseEnter={() =>
                  setMegaOpen("wellness")
                }
                onFocus={() =>
                  setMegaOpen("wellness")
                }
                onClick={() =>
                  setMegaOpen(
                    megaOpen === "wellness"
                      ? null
                      : "wellness",
                  )
                }
              >
                {copy.wellness}
              </button>

              <span
                className={
                  styles.categoryDivider
                }
              />

              <Link href="/shop">
                {copy.brands}
              </Link>

              <Link href="/#health-goals">
                {copy.health}
              </Link>
            </div>

            <div className={styles.categoryPromos}>
              <Link
                href="/#flash-deals"
                className={styles.dealLink}
              >
                {copy.deals}
              </Link>

              <Link href="/shop?sort=rating">
                {copy.best}
              </Link>

              <Link href="/shop">
                {copy.new}
              </Link>

              <Link
                href="/#value-sets"
                className={styles.bundleLink}
              >
                {copy.bundles}
              </Link>
            </div>
          </div>
        </nav>

        <DesktopMegaMenu
          active={megaOpen}
          onClose={() =>
            setMegaOpen(null)
          }
        />
      </header>

      {/* ======================================================
          SIDE DRAWER
          ====================================================== */}
      <div
        className={
          menuOpen
            ? `${styles.drawerBackdrop} ${styles.drawerBackdropOpen}`
            : styles.drawerBackdrop
        }
        onMouseDown={closeMenu}
        aria-hidden={!menuOpen}
      >
        <aside
          className={
            menuOpen
              ? `${styles.drawer} ${styles.drawerOpen}`
              : styles.drawer
          }
          dir={
            isArabic
              ? "rtl"
              : "ltr"
          }
          onMouseDown={(event) =>
            event.stopPropagation()
          }
        >
          <div className={styles.drawerHeader}>
            <Link
              href="/account/sign-in"
              className={styles.welcome}
              onClick={closeMenu}
            >
              <UserRound
                size={25}
                strokeWidth={1.45}
              />

              <strong>
                {copy.welcome}
              </strong>
            </Link>

            <button
              type="button"
              className={styles.closeButton}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X
                size={25}
                strokeWidth={1.4}
              />
            </button>
          </div>

          <div className={styles.drawerScroll}>
            <section className={styles.menuSection}>
              <span className={styles.sectionLabel}>
                {copy.categories}
              </span>

              <nav className={styles.simpleLinks}>
                {drawerCategories.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                    >
                      <span>
                        {item.label}
                      </span>

                      <ChevronRight
                        size={20}
                        strokeWidth={1.5}
                      />
                    </Link>
                  ),
                )}
              </nav>
            </section>

            <section className={styles.menuSection}>
              <span className={styles.sectionLabel}>
                {copy.shopBy}
              </span>

              <nav className={styles.simpleLinks}>
                <Link
                  href="/#health-goals"
                  onClick={closeMenu}
                >
                  <span className={styles.linkWithIcon}>
                    <Sparkles
                      size={18}
                      strokeWidth={1.4}
                    />
                    {copy.health}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>

                <Link
                  href="/shop"
                  onClick={closeMenu}
                >
                  <span className={styles.linkWithIcon}>
                    <Package
                      size={18}
                      strokeWidth={1.4}
                    />
                    {copy.brands}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>

                <Link
                  href="/#flash-deals"
                  onClick={closeMenu}
                  className={styles.accentLink}
                >
                  <span className={styles.linkWithIcon}>
                    <BadgePercent
                      size={18}
                      strokeWidth={1.4}
                    />
                    {copy.deals}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>

                <Link
                  href="/shop?sort=rating"
                  onClick={closeMenu}
                >
                  <span className={styles.linkWithIcon}>
                    <Trophy
                      size={18}
                      strokeWidth={1.4}
                    />
                    {copy.best}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>

                <Link
                  href="/#value-sets"
                  onClick={closeMenu}
                >
                  <span className={styles.linkWithIcon}>
                    <ShoppingBag
                      size={18}
                      strokeWidth={1.4}
                    />
                    {copy.bundles}
                  </span>

                  <ChevronRight
                    size={20}
                    strokeWidth={1.5}
                  />
                </Link>
              </nav>
            </section>

            <section className={styles.accountSection}>
              <Link
                href="/account"
                onClick={closeMenu}
              >
                <UserRound
                  size={19}
                  strokeWidth={1.4}
                />
                {copy.account}
              </Link>

              <Link
                href="/account"
                onClick={closeMenu}
              >
                <Package
                  size={19}
                  strokeWidth={1.4}
                />
                {copy.orders}
              </Link>

              <Link
                href="/account"
                onClick={closeMenu}
              >
                <Sparkles
                  size={19}
                  strokeWidth={1.4}
                />
                {copy.rewards}
              </Link>
            </section>

            <div className={styles.marketRow}>
              <Globe2
                size={20}
                strokeWidth={1.4}
              />

              <span>EG</span>

              <span
                className={
                  styles.marketDivider
                }
              />

              <button
                type="button"
                onClick={() =>
                  setLanguage(
                    isArabic
                      ? "en"
                      : "ar",
                  )
                }
              >
                {isArabic
                  ? "EN"
                  : "AR"}
              </button>

              <span
                className={
                  styles.marketDivider
                }
              />

              <strong>
                EGP
              </strong>
            </div>
          </div>

          <Link
            href="/account/sign-in"
            className={styles.drawerCta}
            onClick={closeMenu}
          >
            {copy.create}
          </Link>
        </aside>
      </div>

      <GlobalSearch
        open={searchOpen}
        onClose={() =>
          setSearchOpen(false)
        }
        isArabic={isArabic}
      />

      <MobileBottomNav
        isArabic={isArabic}
        onOpenSearch={openSearch}
      />
    </>
  );
}
