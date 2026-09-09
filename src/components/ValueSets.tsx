"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  PackagePlus,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

import styles from "./ValueSets.module.css";

const bundleDefinitions = [
  {
    title: "STRENGTH ROUTINE",
    eyebrow: "TRAIN + BUILD",
    description:
      "Creatine and whey together for a simple training routine.",
    slugs: [
      "nutri-nations-creatine",
      "whey-x",
    ],
  },
  {
    title: "DAILY ESSENTIALS",
    eyebrow: "EVERYDAY WELLNESS",
    description:
      "A simple daily pairing for general wellness support.",
    slugs: [
      "for-him-multivitamin",
      "omega-x",
    ],
  },
  {
    title: "CALM + RECOVER",
    eyebrow: "REST + RECOVERY",
    description:
      "Magnesium and ashwagandha in one recovery-focused set.",
    slugs: [
      "doctors-best-high-absorption-magnesium",
      "now-foods-ashwagandha-450",
    ],
  },
];

const bundles = bundleDefinitions.map((bundle) => ({
  ...bundle,
  products: bundle.slugs
    .map((slug) =>
      products.find((product) => product.slug === slug),
    )
    .filter(Boolean) as typeof products,
}));

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-EG").format(value);
}

export default function ValueSets() {
  const { addItem } = useCart();

  return (
    <section id="value-sets" className={styles.section}>
      <div className={styles.heading}>
        <div>
          <span>VI2 VALUE SETS</span>

          <h2>
            BUILD A
            <br />
            ROUTINE.
          </h2>
        </div>

        <Link href="/shop">
          SHOP INDIVIDUALLY
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className={styles.grid}>
        {bundles.map((bundle, index) => {
          const total = bundle.products.reduce(
            (sum, product) =>
              sum + product.price,
            0,
          );

          return (
            <article
              key={bundle.title}
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{bundle.eyebrow}</strong>
              </div>

              <div className={styles.images}>
                {bundle.products.map(
                  (product, productIndex) => (
                    <Image
                      key={product.id}
                      src={product.image}
                      alt={product.name}
                      width={420}
                      height={500}
                      className={
                        productIndex === 0
                          ? styles.imageOne
                          : styles.imageTwo
                      }
                    />
                  ),
                )}
              </div>

              <div className={styles.content}>
                <h3>{bundle.title}</h3>

                <p>{bundle.description}</p>

                <div className={styles.includes}>
                  {bundle.products.map((product) => (
                    <span key={product.id}>
                      <Check
                        size={12}
                        strokeWidth={1.6}
                      />
                      {product.shortName}
                    </span>
                  ))}
                </div>

                <div className={styles.actionRow}>
                  <strong>
                    {formatPrice(total)} EGP
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      bundle.products.forEach(
                        (product) =>
                          addItem(product, 1),
                      )
                    }
                  >
                    <PackagePlus
                      size={16}
                      strokeWidth={1.5}
                    />
                    ADD SET
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
