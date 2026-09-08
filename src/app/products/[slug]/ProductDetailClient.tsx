"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

import styles from "./ProductDetail.module.css";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-EG").format(value);
}

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const maxQuantity = Math.max(1, Math.min(product.stock, 10));

  const total = useMemo(
    () => product.price * quantity,
    [product.price, quantity],
  );

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(maxQuantity, current + 1),
    );
  }

  function handleAddToCart() {
    addItem(product, quantity);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1400);
  }

  function handleBuyNow() {
    router.push(
      `/checkout?buyNow=${encodeURIComponent(
        product.slug,
      )}&quantity=${quantity}`,
    );
  }

  return (
    <>
      <main className={styles.page}>
        <div className={styles.topBar}>
          <Link href="/shop" className={styles.backLink}>
            <ArrowLeft size={15} strokeWidth={1.6} />
            BACK TO SHOP
          </Link>

          <span>{product.category.toUpperCase()}</span>
        </div>

        <section className={styles.productLayout}>
          <div className={styles.visualPanel}>
            {product.badge && (
              <span className={styles.badge}>
                {product.badge}
              </span>
            )}

            <div className={styles.visualGlow} />

            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />

            <span className={styles.visualIndex}>01</span>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.infoInner}>
              <span className={styles.brand}>
                {product.brand}
              </span>

              <h1>{product.shortName}</h1>

              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      strokeWidth={1.4}
                      fill={
                        index < Math.round(product.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <strong>{product.rating}</strong>

                <span>
                  {new Intl.NumberFormat("en-EG").format(
                    product.reviewCount,
                  )}{" "}
                  reviews
                </span>
              </div>

              <div className={styles.priceBlock}>
                <strong>
                  {formatPrice(product.price)} EGP
                </strong>

                {product.compareAtPrice && (
                  <span>
                    {formatPrice(product.compareAtPrice)} EGP
                  </span>
                )}
              </div>

              <p className={styles.description}>
                {product.description}
              </p>

              <div className={styles.productFacts}>
                {product.size && (
                  <div>
                    <span>SIZE</span>
                    <strong>{product.size}</strong>
                  </div>
                )}

                {product.servings && (
                  <div>
                    <span>SERVINGS</span>
                    <strong>{product.servings}</strong>
                  </div>
                )}

                <div>
                  <span>AVAILABILITY</span>
                  <strong
                    className={
                      product.stock > 8
                        ? styles.inStock
                        : styles.lowStock
                    }
                  >
                    {product.stock > 8
                      ? "IN STOCK"
                      : "LOW STOCK"}
                  </strong>
                </div>
              </div>

              {product.flavor && (
                <div className={styles.optionBlock}>
                  <span className={styles.optionLabel}>
                    FLAVOR
                  </span>

                  <button
                    type="button"
                    className={styles.selectedOption}
                  >
                    {product.flavor}
                  </button>
                </div>
              )}

              <div className={styles.purchaseRow}>
                <div className={styles.quantity}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={15} strokeWidth={1.6} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={increaseQuantity}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus size={15} strokeWidth={1.6} />
                  </button>
                </div>

                <div className={styles.quantityPrice}>
                  <span>TOTAL</span>
                  <strong>{formatPrice(total)} EGP</strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check size={17} strokeWidth={1.8} />
                      ADDED
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} strokeWidth={1.6} />
                      ADD TO CART
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={styles.buyButton}
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </button>
              </div>

              <div className={styles.fastNote}>
                <Truck size={17} strokeWidth={1.5} />
                <span>
                  Free delivery on orders over 2,500 EGP.
                </span>
              </div>

              <div className={styles.accordions}>
                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setDetailsOpen((current) => !current)
                  }
                >
                  <span>PRODUCT DETAILS</span>

                  <ChevronDown
                    size={17}
                    className={
                      detailsOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {detailsOpen && (
                  <div className={styles.accordionContent}>
                    <p>{product.description}</p>
                    <ul>
                      {product.size && (
                        <li>Size: {product.size}</li>
                      )}
                      {product.servings && (
                        <li>
                          {product.servings} servings
                        </li>
                      )}
                      <li>
                        Stored and delivered with product
                        integrity in mind.
                      </li>
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className={styles.accordionButton}
                  onClick={() =>
                    setDeliveryOpen((current) => !current)
                  }
                >
                  <span>DELIVERY & RETURNS</span>

                  <ChevronDown
                    size={17}
                    className={
                      deliveryOpen ? styles.chevronOpen : ""
                    }
                  />
                </button>

                {deliveryOpen && (
                  <div className={styles.accordionContent}>
                    <p>
                      Delivery pricing is shown before placing
                      the order. Orders above 2,500 EGP receive
                      free delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.trustSection}>
          <div>
            <ShieldCheck size={22} strokeWidth={1.4} />
            <strong>AUTHENTIC PRODUCTS</strong>
            <span>Carefully selected products.</span>
          </div>

          <div>
            <PackageCheck size={22} strokeWidth={1.4} />
            <strong>SECURE PACKAGING</strong>
            <span>Prepared carefully for delivery.</span>
          </div>

          <div>
            <Truck size={22} strokeWidth={1.4} />
            <strong>DELIVERY ACROSS EGYPT</strong>
            <span>Simple checkout and delivery.</span>
          </div>
        </section>
      </main>

      <div className={styles.mobileBuyBar}>
        <div>
          <span>{product.shortName}</span>
          <strong>{formatPrice(total)} EGP</strong>
        </div>

        <button type="button" onClick={handleBuyNow}>
          BUY NOW
        </button>
      </div>
    </>
  );
}
