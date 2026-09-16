"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCart } from "@/context/CartContext";
import {
  getProductBySlug,
  products,
} from "@/data/products";

import styles from "./Account.module.css";

type StoredItem = {
  slug?: string;
  quantity?: number;
  price?: number;
  name?: string;
};

type StoredOrder = {
  reference?: string;
  createdAt?: string;
  total?: number;
  items?: StoredItem[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-EG").format(value);
}

export default function AccountClient() {
  const { addItem } = useCart();

  const [lastOrder, setLastOrder] =
    useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          "vi2-last-order",
        );

      if (raw) {
        setLastOrder(
          JSON.parse(raw) as StoredOrder,
        );
      }
    } catch {
      setLastOrder(null);
    }
  }, []);

  const orderProducts = useMemo(
    () =>
      (lastOrder?.items ?? [])
        .map((item) => {
          const product =
            item.slug
              ? getProductBySlug(item.slug)
              : undefined;

          return product
            ? {
                product,
                quantity:
                  Math.max(
                    1,
                    Number(item.quantity) || 1,
                  ),
              }
            : null;
        })
        .filter(Boolean) as {
        product: (typeof products)[number];
        quantity: number;
      }[],
    [lastOrder],
  );

  const points =
    Math.floor(
      Number(lastOrder?.total ?? 0) / 10,
    );

  const fallbackProducts =
    [...products]
      .sort(
        (a, b) =>
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount,
      )
      .slice(0, 3);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>VI2 ACCOUNT</span>

          <h1 data-arabic-text="عافيتك.">
            YOUR
            <br />
            WELLNESS.
          </h1>

          <p>
            Accounts can add points, order history,
            faster reordering and personalized
            benefits — while guest checkout stays
            available.
          </p>
        </div>

        <div className={styles.pointsCard}>
          <Sparkles
            size={24}
            strokeWidth={1.35}
          />

          <span>VI2 POINTS</span>

          <strong>
            {new Intl.NumberFormat(
              "en-EG",
            ).format(points)}
          </strong>

          <p>
            Points preview based on eligible orders
            stored in this browser.
          </p>
        </div>
      </section>

      <section className={styles.quickGrid}>
        <div>
          <UserRound size={20} />

          <strong>
            ACCOUNT BENEFITS
          </strong>

          <span>
            Saved details, points and a faster return
            visit.
          </span>
        </div>

        <div>
          <PackageCheck size={20} />

          <strong>
            ORDER HISTORY
          </strong>

          <span>
            Keep purchases organized in one place.
          </span>
        </div>

        <div>
          <RotateCcw size={20} />

          <strong>
            BUY IT AGAIN
          </strong>

          <span>
            Reorder routine products with fewer
            steps.
          </span>
        </div>
      </section>

      <section className={styles.reorder}>
        <div className={styles.sectionHeading}>
          <div>
            <span>QUICK REPLENISH</span>
            <h2>BUY IT AGAIN</h2>
          </div>

          <Link href="/shop">
            SHOP ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        {orderProducts.length > 0 ? (
          <div className={styles.reorderGrid}>
            {orderProducts.map(
              ({ product, quantity }) => (
                <article
                  key={product.id}
                  className={styles.reorderCard}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className={styles.imageArea}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={420}
                      height={480}
                    />
                  </Link>

                  <div className={styles.reorderContent}>
                    <span>{product.brand}</span>

                    <h3>{product.shortName}</h3>

                    <div className={styles.reorderMeta}>
                      <span>
                        LAST QTY: {quantity}
                      </span>

                      <strong>
                        {formatPrice(
                          product.price,
                        )}{" "}
                        EGP
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addItem(product, quantity)
                      }
                    >
                      <Plus size={16} />
                      ADD AGAIN
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className={styles.recommended}>
            <div className={styles.emptyOrder}>
              <span>NO LOCAL ORDER YET</span>

              <h3>
                YOUR NEXT ROUTINE
                STARTS HERE.
              </h3>

              <p>
                Once an order is placed, its products
                can appear here for quick reordering.
              </p>
            </div>

            <div className={styles.miniProducts}>
              {fallbackProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={210}
                  />

                  <div>
                    <span>{product.brand}</span>

                    <strong>
                      {product.shortName}
                    </strong>

                    <small>
                      <Star
                        size={10}
                        fill="currentColor"
                      />
                      {product.rating}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
