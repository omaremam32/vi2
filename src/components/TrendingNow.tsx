"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { products } from "@/data/products";

import styles from "./TrendingNow.module.css";

const railSlugs = [
  "nutri-nations-creatine",
  "whey-x",
  "doctors-best-high-absorption-magnesium",
  "now-foods-omega-3-200-softgels",
  "california-gold-vitamin-d3-5000",
  "california-gold-collagenup-206g",
  "california-gold-gold-c-vitamin-c-1000",
  "now-foods-zinc-picolinate-50",
  "now-foods-creatine-capsules",
  "now-foods-ashwagandha-450",
  "california-gold-lactobif-30",
  "california-gold-coq10-100",
  "optimum-nutrition-gold-standard-whey-chocolate-malt",
];

const transparentImages: Record<string, string> = {
  "nutri-nations-creatine":
    "/products/trending-rail/nutri-creatine-transparent.png",
  "whey-x":
    "/products/trending-rail/whey-x-transparent.png",
  "doctors-best-high-absorption-magnesium":
    "/products/trending-rail/doctors-best-magnesium-transparent.png",
  "now-foods-omega-3-200-softgels":
    "/products/trending-rail/now-omega-3-transparent.png",
  "california-gold-vitamin-d3-5000":
    "/products/trending-rail/vitamin-d3-transparent.png",
  "california-gold-collagenup-206g":
    "/products/trending-rail/collagenup-transparent.png",
  "california-gold-gold-c-vitamin-c-1000":
    "/products/trending-rail/gold-c-transparent.png",
  "now-foods-zinc-picolinate-50":
    "/products/trending-rail/zinc-picolinate-transparent.png",
  "now-foods-creatine-capsules":
    "/products/trending-rail/creatine-monohydrate-transparent.png",
  "now-foods-ashwagandha-450":
    "/products/trending-rail/ashwagandha-transparent.png",
  "california-gold-lactobif-30":
    "/products/trending-rail/lactobif-transparent.png",
  "california-gold-coq10-100":
    "/products/trending-rail/coq10-transparent.png",
  "optimum-nutrition-gold-standard-whey-chocolate-malt":
    "/products/trending-rail/on-whey-transparent.png",
};

export default function TrendingNow() {
  const railProducts = railSlugs
    .map((slug) =>
      products.find(
        (product) =>
          product.slug === slug,
      ),
    )
    .filter(
      (
        product,
      ): product is NonNullable<
        typeof product
      > => Boolean(product),
    );

  if (railProducts.length === 0) {
    return null;
  }

  const movingProducts = [
    ...railProducts,
    ...railProducts,
  ];

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div>
          <span>VI2 PICKS</span>

          <h2>
            TRENDING NOW
          </h2>
        </div>

        <Link href="/shop">
          VIEW ALL

          <ArrowRight
            size={16}
            strokeWidth={1.6}
          />
        </Link>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track}>
          {movingProducts.map(
            (product, index) => {
              const image =
                transparentImages[
                  product.slug
                ];

              return (
                <Link
                  key={`${product.slug}-${index}`}
                  href={`/products/${product.slug}`}
                  className={styles.item}
                  aria-label={`View ${product.name}`}
                  title={product.name}
                >
                  <div className={styles.imageFrame}>
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
