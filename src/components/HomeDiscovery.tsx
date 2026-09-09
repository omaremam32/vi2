import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Dumbbell,
  Heart,
  Moon,
  ShieldCheck,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

import styles from "./HomeDiscovery.module.css";

const goals = [
  {
    name: "IMMUNE SUPPORT",
    query: "Immune Support",
    description:
      "Vitamin C, D3, zinc and everyday immune essentials.",
    icon: ShieldCheck,
  },
  {
    name: "GUT HEALTH",
    query: "Gut Health",
    description:
      "Probiotics and digestive-support routines.",
    icon: Activity,
  },
  {
    name: "MUSCLE & RECOVERY",
    query: "Muscle & Recovery",
    description:
      "Protein, creatine and recovery-focused nutrition.",
    icon: Dumbbell,
  },
  {
    name: "ENERGY & FITNESS",
    query: "Energy & Fitness",
    description:
      "Performance and daily energy support.",
    icon: Activity,
  },
  {
    name: "HEART HEALTH",
    query: "Heart Health",
    description:
      "Omega and cardiovascular wellness essentials.",
    icon: Heart,
  },
  {
    name: "STRESS & SLEEP",
    query: "Stress & Sleep",
    description:
      "Calm, sleep and stress-support routines.",
    icon: Moon,
  },
];

const bestSellers = [...products]
  .sort(
    (a, b) =>
      Number(b.badge === "Best Seller") -
        Number(a.badge === "Best Seller") ||
      b.rating - a.rating ||
      b.reviewCount - a.reviewCount,
  )
  .slice(0, 4);

const brands = Array.from(
  new Set(products.map((product) => product.brand)),
).slice(0, 8);

export default function HomeDiscovery() {
  return (
    <>
      <section className={styles.goalsSection}>
        <div className={styles.heading}>
          <div>
            <span>SHOP BY HEALTH GOAL</span>
            <h2>
              START WITH
              <br />
              WHAT YOU NEED.
            </h2>
          </div>

          <Link href="/categories#health-goals">
            VIEW ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.goalGrid}>
          {goals.map((goal, index) => {
            const Icon = goal.icon;

            return (
              <Link
                key={goal.name}
                href={`/shop?goal=${encodeURIComponent(
                  goal.query,
                )}`}
                className={styles.goalCard}
              >
                <div className={styles.goalTop}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    size={24}
                    strokeWidth={1.35}
                  />
                </div>

                <div>
                  <h3>{goal.name}</h3>
                  <p>{goal.description}</p>
                </div>

                <ArrowRight
                  className={styles.goalArrow}
                  size={20}
                  strokeWidth={1.5}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.bestSection}>
        <div className={styles.heading}>
          <div>
            <span>POPULAR RIGHT NOW</span>
            <h2>BEST SELLERS</h2>
          </div>

          <Link href="/shop">
            SHOP ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.productGrid}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      <section className={styles.brandSection}>
        <div className={styles.brandIntro}>
          <span>BRANDS AT VI2</span>

          <h2>
            ONE STORE.
            <br />
            TRUSTED NAMES.
          </h2>

          <p>
            Discover Vi2 products alongside selected
            international supplement brands in one
            organized catalog.
          </p>
        </div>

        <div className={styles.brandList}>
          {brands.map((brand, index) => (
            <Link
              key={brand}
              href={`/shop?brand=${encodeURIComponent(
                brand,
              )}`}
              className={styles.brandItem}
            >
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong>{brand}</strong>

              <ArrowRight
                size={16}
                strokeWidth={1.5}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.dailyStrip}>
        <div>
          <span>DAILY DISCOVERY</span>
          <strong>
            FIND TODAY&apos;S VI2 PICKS
          </strong>
        </div>

        <p>
          A rotating edit of popular wellness and
          sports-nutrition products.
        </p>

        <Link href="/shop">
          EXPLORE
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
