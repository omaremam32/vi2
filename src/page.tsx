import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Check,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import TrendingNow from "@/components/TrendingNow";
import HomeDiscovery from "@/components/HomeDiscovery";

import styles from "./Home.module.css";

const categoryProducts = {
  protein: {
    image:
      "/products/categories/protein-isolate-transparent.png",
    alt: "California Gold Nutrition Sport Whey Protein Isolate",
  },
  creatine: {
    image:
      "/products/categories/creatine-transparent.png",
    alt: "California Gold Nutrition Creatine Monohydrate",
  },
  vitamins: {
    image:
      "/products/categories/vitamin-d3-transparent.png",
    alt: "California Gold Nutrition Vitamin D3",
  },
  wellness: {
    image:
      "/products/categories/ultra-omega-3-transparent.png",
    alt: "NOW Foods Ultra Omega-3",
  },
};

export default function Home() {
  return (
    <main>
      {/* ======================================================
          HERO
          ====================================================== */}
      <section className={styles.hero}>
        <Image
          src="/hero/vi2-hero-products.png"
          alt="Vi2 supplements collection"
          fill
          priority
          quality={100}
          sizes="100vw"
          className={styles.heroImage}
        />

        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <Image
              src="/brand/vi2-logo-mark-black.png"
              alt="Vi2"
              width={104}
              height={130}
              priority
              className={styles.heroLogo}
            />

            <h1>
              LIVE WELL,
              <br />
              LIVE FULLY.
            </h1>

            <p>
              Premium supplements, rooted in wellness
              and backed by quality.
            </p>

            <Link
              href="/shop"
              className={styles.heroButton}
            >
              SHOP NOW

              <ArrowRight
                size={17}
                strokeWidth={1.7}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          TRUST STRIP
          ====================================================== */}
      <section className="trust-strip">
        <div className="trust-item">
          <ShieldCheck
            size={21}
            strokeWidth={1.5}
          />

          <div>
            <strong>
              AUTHENTIC PRODUCTS
            </strong>

            <span>
              Quality you can trust
            </span>
          </div>
        </div>

        <div className="trust-item">
          <Truck
            size={21}
            strokeWidth={1.5}
          />

          <div>
            <strong>
              FAST DELIVERY
            </strong>

            <span>
              Across Egypt
            </span>
          </div>
        </div>

        <div className="trust-item">
          <PackageCheck
            size={21}
            strokeWidth={1.5}
          />

          <div>
            <strong>
              SECURE PACKAGING
            </strong>

            <span>
              Handled with care
            </span>
          </div>
        </div>

        <div className="trust-item">
          <Check
            size={21}
            strokeWidth={1.5}
          />

          <div>
            <strong>
              EASY CHECKOUT
            </strong>

            <span>
              Buy in just a few steps
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================
          CATEGORIES
          ====================================================== */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              SHOP BY CATEGORY
            </span>

            <h2>
              WHAT ARE YOU
              <br />
              LOOKING FOR?
            </h2>
          </div>

          <Link
            href="/shop"
            className="section-link"
          >
            VIEW ALL

            <ArrowRight
              size={16}
              strokeWidth={1.7}
            />
          </Link>
        </div>

        <div className="category-grid">
          <Link
            href="/shop?category=Protein"
            className="category-card category-card-cream"
          >
            <span className="category-number">
              01
            </span>

            <div className={styles.categoryProduct}>
              <div className={styles.categoryProductGlow} />

              <img
                src={categoryProducts.protein.image}
                alt={categoryProducts.protein.alt}
                loading="lazy"
                decoding="async"
                className={`${styles.categoryProductImage} ${styles.proteinImage}`}
              />
            </div>

            <div>
              <h3>PROTEIN</h3>

              <p>
                Everyday protein and sports
                nutrition.
              </p>
            </div>

            <ArrowRight
              className="category-arrow"
              size={22}
            />
          </Link>

          <Link
            href="/shop?category=Creatine"
            className="category-card category-card-green"
          >
            <span className="category-number">
              02
            </span>

            <div className={styles.categoryProduct}>
              <div className={styles.categoryProductGlow} />

              <img
                src={categoryProducts.creatine.image}
                alt={categoryProducts.creatine.alt}
                loading="lazy"
                decoding="async"
                className={`${styles.categoryProductImage} ${styles.creatineImage}`}
              />
            </div>

            <div>
              <h3>CREATINE</h3>

              <p>
                Performance essentials for
                training.
              </p>
            </div>

            <ArrowRight
              className="category-arrow"
              size={22}
            />
          </Link>

          <Link
            href="/shop?category=Vitamins"
            className="category-card category-card-stone"
          >
            <span className="category-number">
              03
            </span>

            <div className={styles.categoryProduct}>
              <div className={styles.categoryProductGlow} />

              <img
                src={categoryProducts.vitamins.image}
                alt={categoryProducts.vitamins.alt}
                loading="lazy"
                decoding="async"
                className={`${styles.categoryProductImage} ${styles.vitaminsImage}`}
              />
            </div>

            <div>
              <h3>VITAMINS</h3>

              <p>
                Daily essentials made simple.
              </p>
            </div>

            <ArrowRight
              className="category-arrow"
              size={22}
            />
          </Link>

          <Link
            href="/shop?category=Wellness"
            className="category-card category-card-dark"
          >
            <span className="category-number">
              04
            </span>

            <div className={styles.categoryProduct}>
              <div className={styles.categoryProductGlow} />

              <img
                src={categoryProducts.wellness.image}
                alt={categoryProducts.wellness.alt}
                loading="lazy"
                decoding="async"
                className={`${styles.categoryProductImage} ${styles.wellnessImage}`}
              />
            </div>

            <div>
              <h3>WELLNESS</h3>

              <p>
                Everyday support for your routine.
              </p>
            </div>

            <ArrowRight
              className="category-arrow"
              size={22}
            />
          </Link>
        </div>
      </section>

      {/* ======================================================
          SARAH / IHERB DISCOVERY RENOVATION
          ====================================================== */}
      <HomeDiscovery />

      {/* ======================================================
          TRENDING NOW
          ====================================================== */}
      <TrendingNow />

      {/* ======================================================
          FINAL BRAND STATEMENT
          ====================================================== */}
      <section className="brand-statement">
        <span>
          LIVE WELL, LIVE FULLY.
        </span>

        <p>
          VI2 · DIETARY & WELLNESS SUPPLEMENTS
        </p>
      </section>
    </main>
  );
}
