"use client";

import Link from "next/link";
import {
  Plus,
  Star,
} from "lucide-react";

import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-EG").format(value);
}

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addItem } = useCart();

  return (
    <article className={styles.card}>
      <Link
        href={`/products/${product.slug}`}
        className={styles.imageArea}
        aria-label={`View ${product.name}`}
      >
        {product.badge && (
          <span className={styles.badge}>
            {product.badge}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={styles.image}
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <span className={styles.brand}>
            {product.brand}
          </span>

          <div
            className={styles.rating}
            aria-label={`${product.rating} out of 5 stars`}
          >
            <Star
              size={11}
              fill="currentColor"
              strokeWidth={1.5}
            />

            <span>{product.rating}</span>
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className={styles.name}
        >
          {product.shortName}
        </Link>

        <p className={styles.meta}>
          {[product.flavor, product.size]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <div className={styles.bottom}>
          <div className={styles.price}>
            <strong>
              {formatPrice(product.price)} EGP
            </strong>

            {product.compareAtPrice && (
              <span>
                {formatPrice(product.compareAtPrice)} EGP
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.addButton}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem(product)}
          >
            <Plus
              size={18}
              strokeWidth={1.6}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
